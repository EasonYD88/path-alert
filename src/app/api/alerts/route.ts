import { NextResponse } from 'next/server'

// In-memory store for demo (replace with database in production)
let alertsCache: Array<{
  id: string
  source: string
  originalText: string
  alertType: string
  severity: string
  affectedLines: string
  affectedStations: string
  publishedAt: string
  createdAt: string
  notified: boolean
}> = [
  {
    id: '1',
    source: 'panynj',
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const severity = searchParams.get('severity')
  const line = searchParams.get('line')

  let filteredAlerts = [...alertsCache]
  
  if (severity) {
    filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity)
  }

  if (line) {
    filteredAlerts = filteredAlerts.filter(alert => {
      const lines = JSON.parse(alert.affectedLines) as string[]
      return lines.includes(line)
    })
  }

  return NextResponse.json(filteredAlerts.slice(0, limit))
}

export async function POST(request: Request) {
  try {
    // Fetch fresh alerts from PATH website
    // Note: This is a simplified version - in production you'd use proper scraping
    const response = await fetch('https://www.panynj.gov/path/alerts.html', {
      headers: {
        'User-Agent': 'PATH-Alert/1.0'
      },
      next: { revalidate: 60 } // Cache for 1 minute
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const html = await response.text()
    
    // Simple parsing - look for alert patterns in the HTML
    // This is a basic implementation - you may need to adjust based on actual HTML structure
    const alertPatterns = [
      /elevator.*?out of service/gi,
      /escalator.*?out of service/gi,
      /service.*?suspended/gi,
      /delays?/gi,
      /closed/gi
    ]

    // For demo purposes, we'll just return success
    // In production, you'd parse the HTML and update the database
    
    return NextResponse.json({ 
      success: true, 
      message: 'Scraping triggered - using cached data for demo',
      cachedAlerts: alertsCache.length
    })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch alerts',
      message: 'Using cached data'
    }, { status: 500 })
  }
}
