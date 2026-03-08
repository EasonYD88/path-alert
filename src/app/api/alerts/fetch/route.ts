import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseAlert } from '@/lib/alert-parser'

// Nitter instances to try
const NITTER_INSTANCES = [
  'nitter.net',
  'nitter.privacydev.net',
  'nitter.poast.org'
]

async function fetchFromNitter(username: string): Promise<string[]> {
  const tweets: string[] = []
  
  for (const instance of NITTER_INSTANCES) {
    try {
      const response = await fetch(`https://${instance}/${username}/rss`, {
        headers: {
          'User-Agent': 'PATH-Alert/1.0'
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      })
      
      if (response.ok) {
        const text = await response.text()
        // Extract tweet content from RSS
        const matches = text.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/g)
        if (matches) {
          for (const match of matches) {
            const content = match.replace(/<!\[\CDATA\[|\]\]>|<\/description>/g, '')
            // Clean HTML entities and tags
            const cleanContent = content
              .replace(/<[^>]*>/g, '')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .trim()
            if (cleanContent && !cleanContent.includes('RSS')) {
              tweets.push(cleanContent)
            }
          }
        }
        break // Success, no need to try other instances
      }
    } catch (error) {
      console.log(`Failed to fetch from ${instance}:`, error)
      continue
    }
  }
  
  return tweets
}

export async function POST(request: Request) {
  // In production, this should be protected by a secret key
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const tweets = await fetchFromNitter('PATHTrain')
    
    let newAlertsCount = 0
    
    for (const tweet of tweets) {
      // Check if we already have this exact tweet
      const existing = await prisma.alert.findFirst({
        where: { originalText: tweet }
      })
      
      if (!existing) {
        const parsed = parseAlert(tweet)
        
        await prisma.alert.create({
          data: {
            source: 'twitter',
            originalText: parsed.originalText,
            alertType: parsed.alertType,
            severity: parsed.severity,
            affectedLines: JSON.stringify(parsed.affectedLines),
            affectedStations: JSON.stringify(parsed.affectedStations),
            publishedAt: parsed.publishedAt,
            notified: false
          }
        })
        
        newAlertsCount++
      }
    }

    return NextResponse.json({ 
      success: true, 
      tweetsProcessed: tweets.length,
      newAlerts: newAlertsCount 
    })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch alerts' 
    }, { status: 500 })
  }
}
