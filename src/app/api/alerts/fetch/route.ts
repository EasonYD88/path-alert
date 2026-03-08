import { NextResponse } from 'next/server'

// Cron job configuration for Vercel
// Add this to vercel.json:
// {
//   "crons": [
//     {
//       "path": "/api/alerts/fetch",
//       "schedule": "*/15 * * * *"
//     }
//   ]
// }

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  
  // Allow cron jobs or local development
  if (secret && authHeader !== `Bearer ${secret}`) {
    // Check if it's a local request (for testing)
    if (process.env.NODE_ENV !== 'development' && !authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    // Try to fetch from PATH website
    const response = await fetch('https://www.panynj.gov/path/alerts.html', {
      headers: {
        'User-Agent': 'PATH-Alert/1.0',
        'Accept': 'text/html'
      },
      next: { revalidate: 0 }
    })

    let newAlerts = 0
    
    if (response.ok) {
      const html = await response.text()
      
      // Simple pattern matching for alerts
      // In production, you'd use a proper HTML parser
      const patterns = [
        { regex: /elevator.*?out of service/gi, type: 'closure', severity: 'warning' },
        { regex: /escalator.*?out of service/gi, type: 'closure', severity: 'warning' },
        { regex: /service suspended/gi, type: 'suspension', severity: 'critical' },
        { regex: /shut down/gi, type: 'suspension', severity: 'critical' },
        { regex: /delay/gi, type: 'delay', severity: 'warning' },
        { regex: /closed/gi, type: 'closure', severity: 'warning' }
      ]

      // For demo, just log what we found
      console.log('Fetched PATH alerts page, length:', html.length)
    }

    return NextResponse.json({ 
      success: true, 
      timestamp: new Date().toISOString(),
      newAlerts
    })
  } catch (error) {
    console.error('Error in cron:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch alerts' 
    }, { status: 500 })
  }
}
