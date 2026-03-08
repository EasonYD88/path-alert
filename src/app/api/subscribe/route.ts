import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const subscription = await request.json()
    
    await prisma.subscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        keys: JSON.stringify(subscription.keys)
      },
      create: {
        endpoint: subscription.endpoint,
        keys: JSON.stringify(subscription.keys),
        lines: '[]',
        stations: '[]'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save subscription:', error)
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { endpoint } = await request.json()
    
    await prisma.subscription.delete({
      where: { endpoint }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete subscription:', error)
    return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 })
  }
}
