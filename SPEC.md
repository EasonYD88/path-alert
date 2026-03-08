# PATH Alert - Project Specification

## Overview
- **Name**: PATH Alert
- **Type**: Web App (PWA)
- **Core Functionality**: Real-time monitoring of PATH train service alerts from X/Twitter, with push notifications
- **Target Users**: NJ PATH commuters who need to know about service disruptions

---

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Push Notifications**: Web Push API + Service Workers
- **Deployment**: Vercel (frontend) + Railway/Render (if needed)

---

## Features

### 1. Alert Monitoring (Backend)
- [ ] Fetch tweets from @PATHTrain via Nitter RSS or scraping
- [ ] Parse tweets to extract:
  - Alert type (suspension, delay, closure, schedule change)
  - Affected lines (JSQ, Hoboken, 33rd, WTC)
  - Affected stations
  - Time/duration
- [ ] Store alerts in database
- [ ] Deduplicate alerts (don't re-notify for same alert)

### 2. Web Dashboard (Frontend)
- [ ] Show recent alerts in timeline view
- [ ] Filter by line/station
- [ ] Alert severity indicators (critical, warning, info)
- [ ] Dark/Light mode

### 3. Push Notifications
- [ ] Service Worker registration
- [ ] Permission request UI
- [ ] Subscribe to specific lines/stations
- [ ] Send push notifications for new alerts

### 4. User Preferences
- [ ] Select lines to monitor
- [ ] Select stations to monitor
- [ ] Notification frequency (immediate, digest)
- [ ] Store preferences in localStorage

---

## Data Model

### Alert
```typescript
{
  id: string
  source: string // "twitter", "rss", "api"
  originalText: string
  alertType: "suspension" | "delay" | "closure" | "schedule" | "other"
  severity: "critical" | "warning" | "info"
  affectedLines: string[]
  affectedStations: string[]
  publishedAt: Date
  createdAt: Date
}
```

---

## Alert Keywords Mapping

### Severity: Critical
- "suspended", "shut down", "not running", "emergency"

### Severity: Warning  
- "delay", "delayed", "long wait", "crowded"

### Severity: Info
- "schedule change", "modified", "reduced service"

### Lines
- "Journal Square", "JSQ" → JSQ
- "Hoboken" → Hoboken
- "33rd", "33rd Street" → 33rd
- "World Trade Center", "WTC" → WTC

### Stations
- "Newark", "Newark Penn"
- "Harrison"
- "Journal Square"
- "Grove Street"
- "Exchange Place"
- "World Trade Center"
- "PATH stations"

---

## Pages

1. **/** - Home/Dashboard with recent alerts
2. **/settings** - Subscribe to lines/stations, notification preferences
3. **/about** - About the project

---

## UI Design

### Color Scheme
- **Background**: #0f172a (dark) / #f8fafc (light)
- **Critical Alert**: #ef4444 (red)
- **Warning Alert**: #f59e0b (amber)
- **Info Alert**: #3b82f6 (blue)
- **Accent**: #6366f1 (indigo)

### Layout
- Mobile-first design
- Bottom navigation on mobile
- Header with status indicator

---

## Project Structure
```
path-alert/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── alerts/        # GET, POST alerts
│   │   │   ├── subscribe/      # Push subscription
│   │   │   └── fetch/          # Trigger fetch from X
│   │   ├── components/
│   │   ├── lib/
│   │   ├── styles/
│   │   └── page.tsx
│   └──公共/
│       ├── sw.js               # Service Worker
│       └── manifest.json       # PWA manifest
├── prisma/
│   └── schema.prisma
├── package.json
└── README.md
```

---

## ToS Considerations
- This is a community project, not affiliated with PATH or NJ Transit
- Uses publicly available information
- Don't overload X/Nitter with requests (rate limiting)
- Add disclaimer to the app

---

## MVP Milestones

1. ✅ Project setup (Next.js + Prisma)
2. [ ] Basic scraper for Nitter RSS
3. [ ] Alert parsing logic
4. [ ] Dashboard UI
5. [ ] PWA manifest + Service Worker
6. [ ] Push notification setup
7. [ ] User preferences
8. [ ] Deploy to Vercel

---

## License
MIT License - Open source for community use
