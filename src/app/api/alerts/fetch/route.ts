import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseAlert } from '@/lib/alert-parser'

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch from PATH official website
    const response = await fetch('https://www.panynj.gov/path/en/alerts.html', {
      headers: {
        'User-Agent': 'PATH-Alert/1.0'
      },
      next: { revalidate: 300 }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }
    
    const html = await response.text()
    
    // Extract alert content from the page
    // Looking for the pattern: "Today at HH:MMam/pm HH:MM AM/PM: Alert text"
    const alertMatches = html.match(/((?:Today|Yesterday|This week) at \d{1,2}:\d{2}[ap]m[\s\S]*?(?=Today at|Yesterday at|This week at|$))/gi) || []
    
    let newAlertsCount = 0
    
    for (const alertText of alertMatches) {
      // Clean up the alert text
      const cleanedText = alertText.trim().replace(/\s+/g, ' ')
      
      if (cleanedText.length < 20) continue // Skip too short matches
      
      // Check if we already have this exact alert
      const existing = await prisma.alert.findFirst({
        where: { originalText: { contains: cleanedText.substring(0, 50) } }
      })
      
      if (!existing) {
        const parsed = parseAlert(cleanedText)
        
        await prisma.alert.create({
          data: {
            source: 'panynj',
            originalText: cleanedText,
            alertType: parsed.alertType,
            severity: parsed.severity,
            affectedLines: JSON.stringify(parsed.affectedLines),
            affectedStations: JSON.stringify(parsed.affectedStations),
            publishedAt: new Date(),
            notified: false
          }
        })
        
        newAlertsCount++
      }
    }

    return NextResponse.json({ 
      success: true, 
      alertsFound: alertMatches.length,
      newAlerts: newAlertsCount 
    })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch alerts' 
    }, { status: 500 })
  }
}
