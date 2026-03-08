import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Placeholder for push notifications
  return NextResponse.json({ success: true, message: 'Demo mode' })
}

export async function DELETE(request: Request) {
  return NextResponse.json({ success: true })
}
