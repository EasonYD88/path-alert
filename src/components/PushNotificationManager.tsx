'use client'

import { useEffect, useState } from 'react'

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered:', registration)
      
      // Check existing subscription
      const existingSub = await registration.pushManager.getSubscription()
      setSubscription(existingSub)
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }

  const subscribeToPush = async () => {
    if (!isSupported) return

    const base64Key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
    if (!base64Key) {
      console.error('VAPID public key not configured')
      return
    }

    try {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        applicationServerKey: base64Key as any
      })
      setSubscription(sub)
      
      // Send subscription to server
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub)
      })
    } catch (error) {
      console.error('Push subscription failed:', error)
    }
  }

  const unsubscribeFromPush = async () => {
    if (!subscription) return

    try {
      await subscription.unsubscribe()
      setSubscription(null)
      
      // Tell server to remove subscription
      await fetch('/api/subscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint })
      })
    } catch (error) {
      console.error('Push unsubscribe failed:', error)
    }
  }

  if (!isSupported) return null

  return (
    <div className="fixed bottom-20 right-4">
      {subscription ? (
        <button
          onClick={unsubscribeFromPush}
          className="px-4 py-2 bg-zinc-600 text-white text-sm font-medium rounded-lg shadow-lg hover:bg-zinc-700 transition-colors"
        >
          🔔 Notifications On
        </button>
      ) : (
        <button
          onClick={subscribeToPush}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
        >
          🔕 Enable Notifications
        </button>
      )}
    </div>
  )
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer | Uint8Array | null {
  if (!base64String) return null
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
