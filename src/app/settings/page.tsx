'use client'

import { useState } from 'react'

export default function Settings() {
  const [lines, setLines] = useState<string[]>([])
  const [saved, setSaved] = useState(false)

  const allLines = ['JSQ', 'Hoboken', '33rd', 'WTC']
  const allStations = ['Newark', 'Harrison', 'Journal Square', 'Grove Street', 'Exchange Place', 'World Trade Center', 'Newport']

  const toggleLine = (line: string) => {
    setLines(prev => 
      prev.includes(line) 
        ? prev.filter(l => l !== line)
        : [...prev, line]
    )
  }

  const saveSettings = () => {
    // Save to localStorage
    localStorage.setItem('pathAlert:lines', JSON.stringify(lines))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => window.location.href = '/'} className="text-zinc-500 hover:text-zinc-700">
              ← Back
            </button>
            <span className="text-2xl">⚙️</span>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Alert Lines */}
        <section className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
            🚇 Monitored Lines
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Select which PATH lines you want to monitor
          </p>
          <div className="flex flex-wrap gap-2">
            {allLines.map(line => (
              <button
                key={line}
                onClick={() => toggleLine(line)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  lines.includes(line)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {line}
              </button>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
            🔔 Notifications
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Push notifications will be available in a future update.
          </p>
        </section>

        {/* About */}
        <section className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
            ℹ️ About
          </h2>
          <div className="text-sm text-zinc-500 dark:text-zinc-400 space-y-2">
            <p><strong>PATH Alert</strong> v1.0.0</p>
            <p>Real-time PATH train service alerts.</p>
            <p className="pt-2">
              <a 
                href="https://github.com/EasonYD88/path-alert" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                View on GitHub →
              </a>
            </p>
          </div>
        </section>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </main>

      {/* Bottom Nav */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-3">
        <div className="max-w-3xl mx-auto px-4 flex justify-around">
          <button onClick={() => window.location.href = '/'} className="flex flex-col items-center gap-1 text-zinc-400">
            <span>🚇</span>
            <span className="text-xs">Alerts</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-indigo-600">
            <span>⚙️</span>
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </footer>
    </div>
  )
}
