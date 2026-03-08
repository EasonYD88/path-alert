import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const severity = searchParams.get('severity')
  const line = searchParams.get('line')

  const where: Record<string, unknown> = {}
  
  if (severity) {
    where.severity = severity
  }

  const alerts = await prisma.alert.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    take: limit
  })

  // Filter by line if specified
  let filteredAlerts = alerts
  if (line) {
    filteredAlerts = alerts.filter((alert: typeof alerts[number]) => {
      const lines = JSON.parse(alert.affectedLines) as string[]
      return lines.includes(line)
    })
  }

  return NextResponse.json(filteredAlerts)
}
