import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export const STRIPE_PLANS = {
  PRO: {
    name: 'Pro',
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    price: 9.99,
    searches: 100,
    features: ['100 searches/month', 'Priority support', 'Export reports']
  },
  ENTERPRISE: {
    name: 'Enterprise',
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    price: 29.99,
    searches: 500,
    features: ['500 searches/month', '24/7 support', 'API access', 'Custom reports']
  }
} as const;