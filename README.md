# PATH Alert 🚇

Real-time PATH train service alerts monitoring app.

## Features

- 📢 Real-time alerts from @PATHTrain
- 🔔 Push notifications for new alerts
- 📱 PWA support - install on your phone
- 🌓 Dark mode support
- 🔍 Filter by severity

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
npx prisma generate
npx prisma db push
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite database URL (default: `file:./dev.db`) |
| `CRON_SECRET` | Secret for cron job authentication |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | VAPID public key for push notifications |

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite + Prisma
- **PWA**: Service Workers, Web Push API

## License

MIT
