import { NextResponse } from 'next/server'

// Demo alerts for now (database setup needed for production)
const DEMO_ALERTS = [
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

  let filteredAlerts = DEMO_ALERTS
  
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
