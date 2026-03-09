'use client'

import { useState, useEffect } from 'react'

interface Alert {
  id: string
  originalText: string
  alertType: string
  severity: string
  affectedLines: string
  affectedStations: string
  publishedAt: string
  createdAt: string
  sourceUrl?: string
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/10 border-red-500 text-red-500'
    case 'warning':
      return 'bg-amber-500/10 border-amber-500 text-amber-500'
    default:
      return 'bg-blue-500/10 border-blue-500 text-blue-500'
  }
}

function getSeverityBadge(severity: string) {
  switch (severity) {
    case 'critical':
      return 'bg-red-500'
    case 'warning':
      return 'bg-amber-500'
    default:
      return 'bg-blue-500'
  }
}

function getAlertIcon(alertType: string) {
  switch (alertType) {
    case 'suspension':
      return '🚫'
    case 'delay':
      return '⏰'
    case 'closure':
      return '🔒'
    case 'schedule':
      return '📋'
    default:
      return '📢'
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (minutes < 60) {
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else {
    return date.toLocaleDateString()
  }
}

export default function Home() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts?limit=50')
      const data = await res.json()
      setAlerts(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const triggerFetch = async () => {
    try {
      await fetch('/api/alerts/fetch', { method: 'POST' })
      await fetchAlerts()
    } catch (error) {
      console.error('Failed to trigger fetch:', error)
    }
  }

  useEffect(() => {
    fetchAlerts()
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true
    return alert.severity === filter
  })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚇</span>
              <div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">PATH Alert</h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
                </p>
              </div>
            </div>
            <button
              onClick={triggerFetch}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Refresh
            </button>
          </div>
          
          {/* Filter */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {['all', 'critical', 'warning', 'info'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {f === 'all' ? 'All Alerts' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl">✅</span>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">No alerts to display</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              PATH service is running smoothly!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getAlertIcon(alert.alertType)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full text-white ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {formatDate(alert.publishedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap">
                      {alert.originalText}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {JSON.parse(alert.affectedLines || '[]').map((line: string) => (
                        <span key={line} className="px-2 py-0.5 text-xs bg-zinc-200 dark:bg-zinc-700 rounded">
                          {line}
                        </span>
                      ))}
                      {JSON.parse(alert.affectedStations || '[]').map((station: string) => (
                        <span key={station} className="px-2 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-800 rounded">
                          {station}
                        </span>
                      ))}
                    </div>
                    {/* Source Link */}
                    {alert.sourceUrl && (
                      <a 
                        href={alert.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                        View Original Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-3">
        <div className="max-w-3xl mx-auto px-4 flex justify-around">
          <button className="flex flex-col items-center gap-1 text-indigo-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs">Alerts</span>
          </button>
          <a href="/settings" className="flex flex-col items-center gap-1 text-zinc-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Settings</span>
          </a>
        </div>
      </footer>
    </div>
  )
}
