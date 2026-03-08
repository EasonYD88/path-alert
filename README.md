# PATH Alert 🚇

Real-time PATH train service alerts monitoring Web App (PWA).

**Live**: https://path-alert.vercel.app

## Features

- 📢 Real-time alerts dashboard
- 🔔 Push notifications support
- 📱 PWA - install on your phone
- 🌓 Dark mode
- 🔍 Filter by severity (Critical/Warning/Info)
- ⏱️ Auto-refresh every 5 minutes

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Deployment**: Vercel

## Quick Start

```bash
# Clone the repo
git clone https://github.com/EasonYD88/path-alert.git
cd path-alert

# Install dependencies
npm install

# Run locally
npm run dev
```

## Deployment

1. Push to GitHub
2. Import to Vercel
3. Deploy!

## Adding a Database (Optional)

### Option 1: Neon (PostgreSQL)

1. Create free account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to Vercel env vars: `DATABASE_URL`

### Option 2: Vercel KV (Redis)

1. Go to Vercel Dashboard → Storage → Create KV
2. Add to env vars: `KV_REST_API_URL`, `KV_REST_API_TOKEN`

## Data Sources

- **Primary**: panynj.gov/path/alerts.html (Official PATH website)
- **Fallback**: @PATHTrain on X (Twitter)

## License

MIT
