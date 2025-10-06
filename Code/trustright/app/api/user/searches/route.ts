import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { searches, websites } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Cast user to include id field (added by session callback)
    const user = session.user as typeof session.user & { id: string };

    const userSearches = await db
      .select({
        id: searches.id,
        url: searches.url,
        createdAt: searches.createdAt,
        websiteName: websites.name,
        websiteDomain: websites.domain,
        trustScore: websites.trustScore,
      })
      .from(searches)
      .leftJoin(websites, eq(searches.websiteId, websites.id))
      .where(eq(searches.userId, user.id))
      .orderBy(searches.createdAt)
      .limit(50);

    return NextResponse.json(userSearches);

  } catch (error) {
    console.error('Searches fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch searches' },
      { status: 500 }
    );
  }
}