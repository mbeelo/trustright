import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { websites, searches, userSubscriptions } from '@/lib/db/schema';
import { analyzeWebsite } from '@/lib/openai';
import { eq } from 'drizzle-orm';
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Cast user to include id field (added by session callback)
    const user = session.user as typeof session.user & { id: string };

    // Rate limiting - 5 analyses per user per minute
    const clientId = user.email || 'unknown';
    const rateLimitResult = rateLimit(clientId, 5, 60 * 1000);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult.remaining, rateLimitResult.resetTime)
        }
      );
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Check user's subscription and usage limits
    const userSub = await db.query.userSubscriptions.findFirst({
      where: eq(userSubscriptions.userId, user.id),
    });

    if (!userSub || !userSub.isActive) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 403 });
    }

    const searchesUsed = userSub.searchesUsed || 0;
    const searchesLimit = userSub.searchesLimit || 5;

    if (searchesUsed >= searchesLimit) {
      return NextResponse.json({
        error: 'Search limit reached',
        limit: searchesLimit,
        used: searchesUsed
      }, { status: 429 });
    }

    const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

    // For now, always do fresh analysis to test the system
    console.log('Performing fresh analysis for:', domain);
    const analysis = await analyzeWebsite(url);

    // Try to insert or update the website data
    let websiteData;
    try {
      // Try to upsert (insert or update on conflict)
      const inserted = await db.insert(websites).values({
        domain,
        analysisData: analysis,
        companyName: analysis.company_name,
        trustScore: analysis.trustScore,
        // Legacy fields for compatibility
        name: analysis.company_name,
        owner: analysis.parent_company || 'Unknown',
        ultimateControl: analysis.ownership_structure || 'Unknown',
        bias: analysis.industry_lobbying_positions.join(', ') || 'Unknown',
        stakeholders: analysis.political_donations,
        revenue: analysis.secure_payment_methods,
        flags: analysis.recent_negative_press.map(item => item.title),
      }).onConflictDoUpdate({
        target: websites.domain,
        set: {
          analysisData: analysis,
          companyName: analysis.company_name,
          trustScore: analysis.trustScore,
          name: analysis.company_name,
          owner: analysis.parent_company || 'Unknown',
          ultimateControl: analysis.ownership_structure || 'Unknown',
          bias: analysis.industry_lobbying_positions.join(', ') || 'Unknown',
          stakeholders: analysis.political_donations,
          revenue: analysis.secure_payment_methods,
          flags: analysis.recent_negative_press.map(item => item.title),
          lastUpdated: new Date(),
        }
      }).returning();

      websiteData = { ...inserted[0], ...analysis };
    } catch (dbError) {
      console.log('Database upsert failed, using analysis data directly:', dbError);
      // If database fails, still return the analysis
      websiteData = { ...analysis, id: 0 };
    }

    // Record the search if we have a valid websiteId
    if (websiteData.id && websiteData.id > 0) {
      try {
        await db.insert(searches).values({
          userId: user.id,
          websiteId: websiteData.id,
          url,
        });
      } catch (searchError) {
        console.log('Failed to record search:', searchError);
      }
    }

    // Increment user's search count
    await db.update(userSubscriptions)
      .set({
        searchesUsed: searchesUsed + 1,
        updatedAt: new Date(),
      })
      .where(eq(userSubscriptions.userId, user.id));

    return NextResponse.json({
      ...websiteData,
      searchesRemaining: searchesLimit - (searchesUsed + 1),
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze website' },
      { status: 500 }
    );
  }
}