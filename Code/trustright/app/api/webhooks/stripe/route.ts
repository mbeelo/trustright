import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient, STRIPE_PLANS } from '@/lib/stripe';
import { db } from '@/lib/db';
import { userSubscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (!userId || !plan) {
          console.error('Missing metadata in checkout session');
          break;
        }

        const planData = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS];

        // Update user subscription
        await db.update(userSubscriptions)
          .set({
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            stripePriceId: planData.priceId,
            plan: plan,
            searchesLimit: planData.searches,
            searchesUsed: 0, // Reset usage on new subscription
            isActive: true,
            updatedAt: new Date(),
          })
          .where(eq(userSubscriptions.userId, userId));

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice & { subscription: string };
        const subscriptionId = invoice.subscription;

        // Reset monthly usage
        await db.update(userSubscriptions)
          .set({
            searchesUsed: 0,
            currentPeriodStart: new Date(invoice.period_start * 1000),
            currentPeriodEnd: new Date(invoice.period_end * 1000),
            updatedAt: new Date(),
          })
          .where(eq(userSubscriptions.stripeSubscriptionId, subscriptionId));

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        // Downgrade to free plan
        await db.update(userSubscriptions)
          .set({
            plan: 'free',
            searchesLimit: 5,
            searchesUsed: 0,
            isActive: true,
            stripeSubscriptionId: null,
            stripePriceId: null,
            updatedAt: new Date(),
          })
          .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id));

        break;
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}