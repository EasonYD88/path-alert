import { NextResponse } from 'next/server'
import { redis, ALERTS_KEY } from '@/lib/redis'

// Source URLs for different sources
const SOURCE_URLS: Record<string, string> = {
  panynj: 'https://www.panynj.gov/path',
  twitter: 'https://twitter.com/PATHTrain'
}

// Default alerts for initial setup
const DEFAULT_ALERTS = [
  {
    id: '1',
    source: 'panynj',
    sourceUrl: 'https://www.panynj.gov/path',
    originalText: 'At JSQ, the Kiss&Ride elevator from street to concourse out of service until further notice. Please use the ramp.',
    alertType: 'closure',
    severity: 'warning',
    affectedLines: '[]',
    affectedStations: '["Journal Square"]',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    notified: false
  },
  {
    id: '2',
    source: 'panynj',
    sourceUrl: 'https://www.panynj.gov/path',
    originalText: 'PATH service suspended between Newark and World Trade Center due to signal problems. Expect 20-30 minute delays.',
    alertType: 'suspension',
    severity: 'critical',
    affectedLines: '["WTC"]',
    affectedStations: '["Newark", "World Trade Center"]',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date().toISOString(),
    notified: false
  }
]

async function getAlerts() {
  try {
    const alerts = await redis.get<typeof DEFAULT_ALERTS>(ALERTS_KEY)
    if (!alerts || alerts.length === 0) {
      // Initialize with default alerts
      await redis.set(ALERTS_KEY, DEFAULT_ALERTS)
      return DEFAULT_ALERTS
    }
    return alerts
  } catch (error) {
    console.error('Redis error:', error)
    return DEFAULT_ALERTS
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const severity = searchParams.get('severity')

  const alerts = await getAlerts()
  
  let filteredAlerts = [...alerts]
  
  if (severity) {
    filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity)
  }

  return NextResponse.json(filteredAlerts.slice(0, limit))
}

export async function POST(request: Request) {
  try {
    // Fetch fresh alerts from PATH website
    const response = await fetch('https://www.panynj.gov/path/alerts.html', {
      headers: {
        'User-Agent': 'PATH-Alert/1.0'
      },
      next: { revalidate: 60 }
    })

    // For demo, we'll keep using cached data
    // In production, you'd parse the HTML and update Redis
    
    const alerts = await getAlerts()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Using Redis cache',
      cachedAlerts: alerts.length
    })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch alerts'
    }, { status: 500 })
  }
}
