# BitChain App

A modern web app for tracking and analyzing your trading performance.  
Built with **Next.js**, **TypeScript**, **Prisma**, and **NextAuth**, deployed on **Vercel**.

## Features

- User registration and login with secure authentication
- Private trading log per user
- Dashboard with basic analytics
- Trades table with filtering and sorting
- Responsive UI using [Shadcn UI](https://ui.shadcn.com)
- Real-time cryptocurrency data and news

## Tech Stack

- **Framework**: Next.js
- **Styling**: TailwindCSS + Shadcn UI
- **Auth**: NextAuth.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Deployment**: Vercel + GitHub CI/CD
- **APIs**: 
  - CoinGecko API (cryptocurrency data)
  - CryptoPanic API (cryptocurrency news)

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/erikkopcha/bit-chain.git
cd bit-chain
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment

```env
# .env.local
# Database
DATABASE_URL=postgres://...

# Authentication
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# APIs
CRYPTOPANIC_API_KEY=your_cryptopanic_api_key  # Get from https://cryptopanic.com/developers/api/
```

### 4. Set up DB and generate client

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run locally

```bash
npm run dev
```

## API Keys

### CryptoPanic API
- Get your API key from [CryptoPanic Developers](https://cryptopanic.com/developers/api/)
- Used for fetching cryptocurrency news
- Free tier available with rate limits

### CoinGecko API
- No API key required
- Used for fetching cryptocurrency market data
- Free tier available with rate limits

## Deployment

Deployed to [Vercel](https://vercel.com). Connect your GitHub repo, add `.env` variables, and you're live.

## License

MIT
