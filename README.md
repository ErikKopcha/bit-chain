# Chain Log App

A modern web app for tracking and analyzing your trading performance.  
Built with **Next.js**, **TypeScript**, **Prisma**, and **NextAuth**, deployed on **Vercel**.

## Features

- User registration and login with secure authentication
- Private trading log per user
- Dashboard with basic analytics
- Trades table with filtering and sorting
- Responsive UI using [Shadcn UI](https://ui.shadcn.com)

## Tech Stack

- **Framework**: Next.js
- **Styling**: TailwindCSS + Shadcn UI
- **Auth**: NextAuth.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Deployment**: Vercel + GitHub CI/CD

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/trading-journal.git
cd trading-journal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment

```env
# .env.local
DATABASE_URL=postgres://...
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
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

## Deployment

Deployed to [Vercel](https://vercel.com). Connect your GitHub repo, add `.env` variables, and you're live.

## License

MIT
