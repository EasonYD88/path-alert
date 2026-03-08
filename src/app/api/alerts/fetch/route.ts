import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Placeholder - needs proper implementation with database
  // For now, just return success
  return NextResponse.json({ 
    success: true, 
    message: 'Demo mode - alerts are hardcoded'
  })
}
