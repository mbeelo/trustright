# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
TrustRight is a Next.js 15 web application that provides AI-powered transparency analysis of websites. It analyzes website ownership, corporate behavior, political activities, and trust indicators to help users make informed decisions about content they consume.

## Development Commands

### Environment Setup
```bash
npm install                    # Install dependencies
npm run db:generate           # Generate Drizzle schema
npm run db:migrate            # Run database migrations
```

### Development
```bash
npm run dev                   # Start development server (port 8080, Turbopack enabled)
npm run build                 # Build for production
npm run start                 # Start production server
```

### Database
```bash
npm run db:studio             # Open Drizzle Studio for database management
npm run db:push               # Push schema changes to database
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 15 with React 19 (App Router), TailwindCSS 4
- **Backend**: Next.js API Routes, PostgreSQL (Neon), Drizzle ORM
- **Authentication**: NextAuth.js (Google, GitHub, Credentials)
- **AI**: OpenAI GPT-4 for website analysis
- **Payments**: Stripe with webhook automation

### Core Application Flow
1. **URL Input** → Authentication check → Usage validation
2. **AI Analysis** → OpenAI GPT-4 processes website (50+ data points)
3. **Database Storage** → Results saved with user association
4. **Trust Score** → 0-100 scoring with color-coded indicators

### Directory Structure
- `app/` - Next.js App Router (pages, API routes, auth)
- `lib/` - Core business logic (database, auth, AI, payments)
- `lib/db/` - Drizzle ORM schema and database configuration
- `scripts/` - Database migration utilities

### Key Files
- `lib/openai.ts` - AI-powered website analysis engine
- `lib/auth.ts` - NextAuth configuration with multiple providers
- `lib/stripe.ts` - Payment processing and subscription management
- `lib/rate-limiter.ts` - Per-user analysis rate limiting
- `lib/db/schema.ts` - Complete database schema definitions

## Business Model & Usage Limits
- **Free Tier**: 5 searches per user
- **Pro Tier**: $9.99/month for 100 searches
- **Enterprise**: $29.99/month for 500 searches
- **Rate Limiting**: 5 analyses per minute per user

## Database Schema
Key tables: `users`, `websites`, `searches`, `subscriptions`. Users are automatically created on first authentication with Google/GitHub. Subscription management is handled via Stripe webhooks.

## Environment Variables
Required for development:
- `DATABASE_URL` - Neon PostgreSQL connection
- `NEXTAUTH_SECRET` - Session encryption key
- `OPENAI_API_KEY` - AI analysis engine
- `GOOGLE_CLIENT_ID/SECRET` - OAuth authentication
- `STRIPE_*` - Payment processing keys
- `ADMIN_KEY` - Admin dashboard access

## Security & Performance
- Comprehensive security headers in `next.config.js`
- JWT-based sessions with secure OAuth callbacks
- Per-user rate limiting for API abuse prevention
- Turbopack enabled for fast development builds
- WebP/AVIF image optimization with responsive sizing

## Testing & Debugging
- Development server runs on port 8080
- Use Drizzle Studio for database inspection
- Admin dashboard available at `/admin` (requires ADMIN_KEY)
- Bundle analysis enabled in development mode

## Common Development Patterns
- API routes return structured JSON with appropriate HTTP codes
- Error handling includes graceful degradation for AI/database failures
- All database operations use Drizzle ORM with TypeScript safety
- Authentication state managed through NextAuth session provider
- Subscription usage tracked in real-time with database updates