# ClearChoice MVP Setup Guide

## Quick Setup Checklist

### 1. Database Setup (Neon)
- [ ] Create new Neon project at https://neon.tech
- [ ] Copy connection string to `.env.local` as `DATABASE_URL`
- [ ] Run database migrations: `npm run db:generate && npm run db:migrate`

### 2. Authentication Setup (Google OAuth)
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create new project or select existing
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials
- [ ] Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- [ ] Copy Client ID and Secret to `.env.local`
- [ ] Generate NextAuth secret: `openssl rand -base64 32`

### 3. OpenAI Setup
- [ ] Get API key from https://platform.openai.com/api-keys
- [ ] Add to `.env.local` as `OPENAI_API_KEY`

### 4. Stripe Setup (Payments)
- [ ] Create Stripe account at https://stripe.com
- [ ] Get publishable and secret keys from dashboard
- [ ] Create two products: "Pro" ($9.99/month) and "Enterprise" ($29.99/month)
- [ ] Copy price IDs to `.env.local`
- [ ] Set up webhook endpoint for `/api/webhooks/stripe`

### 5. Environment Variables
Copy `.env.local` and fill in all values:

```bash
# Database
DATABASE_URL=postgresql://username:password@host/database

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OpenAI
OPENAI_API_KEY=sk-your_openai_key

# Stripe
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRO_PRICE_ID=price_your_pro_price_id
STRIPE_ENTERPRISE_PRICE_ID=price_your_enterprise_price_id
```

### 6. Run Development Server
```bash
npm install
npm run dev
```

## Deployment (Vercel)

### 1. Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### 2. Set Environment Variables
- Add all environment variables in Vercel dashboard
- Update `NEXTAUTH_URL` to your production domain

### 3. Update OAuth Redirect URIs
- Add production callback URL: `https://yourdomain.com/api/auth/callback/google`

### 4. Update Stripe Webhook
- Point webhook to: `https://yourdomain.com/api/webhooks/stripe`

## Features Included

### ✅ Core Features
- [x] Real-time website ownership analysis via OpenAI
- [x] User authentication with Google OAuth
- [x] Usage-based pricing (Free: 5 searches, Pro: 100, Enterprise: 500)
- [x] Stripe payment integration
- [x] User dashboard with search history
- [x] PostgreSQL database with Neon
- [x] Responsive design

### 🚀 Business Model
- **Free**: 5 searches/month
- **Pro**: $9.99/month, 100 searches
- **Enterprise**: $29.99/month, 500 searches

### 🎯 MVP Status
Ready for production deployment! All core functionality implemented and tested.

## Support
For issues, check the setup steps above or create an issue in the repository.