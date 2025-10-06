import Stripe from 'stripe';

// Create Stripe client lazily to avoid build-time errors
let _stripe: Stripe | null = null;

export function getStripeClient() {
  if (!_stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      // During build time or when API key is missing, return null
      // This prevents build-time errors during static generation
      return null;
    }
    _stripe = new Stripe(secretKey, {
      apiVersion: '2024-12-18.acacia',
    });
  }
  return _stripe;
}

export const stripe = getStripeClient;

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