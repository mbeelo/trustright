# ClearChoice

**See who really owns any website** - Know the incentives behind the content you consume.

## What is ClearChoice?

ClearChoice is a web application that provides transparency into website ownership, revealing who controls the content you read online. Every website has owners, and those owners have incentives. Our tool helps you understand potential biases and conflicts of interest.

## Features

- 🔍 **Real-time Analysis**: Powered by OpenAI for accurate, up-to-date ownership information
- 🔐 **Secure Authentication**: Google OAuth integration
- 📊 **Trust Scoring**: Algorithmic trust scores based on transparency, track record, and independence
- 💳 **Flexible Pricing**: Free tier with paid plans for power users
- 📱 **Responsive Design**: Works on desktop and mobile
- 🎯 **User Dashboard**: Track your search history and usage

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd clearchoice
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.local .env.local.example
   # Fill in your API keys and database URL
   ```

3. **Run Database Migrations**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

For detailed setup instructions, see [SETUP.md](SETUP.md).

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **Authentication**: NextAuth.js with Google OAuth
- **Payments**: Stripe
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel

## Business Model

- **Free**: 5 searches/month
- **Pro**: $9.99/month, 100 searches
- **Enterprise**: $29.99/month, 500 searches

## Contributing

This is an MVP built for rapid deployment. For feature requests or bug reports, please create an issue.

## License

Private - All rights reserved.
