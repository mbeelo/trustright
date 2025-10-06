import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { userSubscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Cast user to include id field (added by session callback)
    const user = session.user as typeof session.user & { id: string };

    const subscription = await db.query.userSubscriptions.findFirst({
      where: eq(userSubscriptions.userId, user.id),
    });

    if (!subscription) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    const searchesUsed = subscription.searchesUsed || 0;
    const searchesLimit = subscription.searchesLimit || 5;

    return NextResponse.json({
      plan: subscription.plan,
      searchesUsed,
      searchesLimit,
      searchesRemaining: searchesLimit - searchesUsed,
      isActive: subscription.isActive,
    });

  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}