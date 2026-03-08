export type AlertType = 'suspension' | 'delay' | 'closure' | 'schedule' | 'other'
export type Severity = 'critical' | 'warning' | 'info'

export interface ParsedAlert {
  originalText: string
  alertType: AlertType
  severity: Severity
  affectedLines: string[]
  affectedStations: string[]
  publishedAt: Date
}

const CRITICAL_KEYWORDS = ['suspended', 'shut down', 'not running', 'emergency', 'closure', 'closed until']
const WARNING_KEYWORDS = ['delay', 'delayed', 'long wait', 'crowded', 'expect delays']
const INFO_KEYWORDS = ['schedule change', 'modified', 'reduced service', 'update']

const LINE_KEYWORDS: Record<string, string[]> = {
  'JSQ': ['journal square', 'jsq'],
  'Hoboken': ['hoboken'],
  '33rd': ['33rd', '33rd street', '33rd st'],
  'WTC': ['world trade center', 'wtc']
}

const STATION_KEYWORDS: Record<string, string[]> = {
  'Newark': ['newark', 'newark penn'],
  'Harrison': ['harrison'],
  'Journal Square': ['journal square'],
  'Grove Street': ['grove street'],
  'Exchange Place': ['exchange place'],
  'World Trade Center': ['world trade center', 'wtc'],
  'Newport': ['newport'],
  'PATH stations': ['path stations', 'all path']
}

export function parseAlert(text: string, publishedAt: Date = new Date()): ParsedAlert {
  const lowerText = text.toLowerCase()
  
  // Determine severity
  let severity: Severity = 'info'
  if (CRITICAL_KEYWORDS.some(kw => lowerText.includes(kw))) {
    severity = 'critical'
  } else if (WARNING_KEYWORDS.some(kw => lowerText.includes(kw))) {
    severity = 'warning'
  } else if (!INFO_KEYWORDS.some(kw => lowerText.includes(kw))) {
    severity = 'info'
  }

  // Determine alert type
  let alertType: AlertType = 'other'
  if (lowerText.includes('suspend')) alertType = 'suspension'
  else if (lowerText.includes('delay')) alertType = 'delay'
  else if (lowerText.includes('close') || lowerText.includes('shut')) alertType = 'closure'
  else if (lowerText.includes('schedule')) alertType = 'schedule'

  // Find affected lines
  const affectedLines: string[] = []
  for (const [line, keywords] of Object.entries(LINE_KEYWORDS)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      affectedLines.push(line)
    }
  }

  // Find affected stations
  const affectedStations: string[] = []
  for (const [station, keywords] of Object.entries(STATION_KEYWORDS)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      affectedStations.push(station)
    }
  }

  return {
    originalText: text,
    alertType,
    severity,
    affectedLines: [...new Set(affectedLines)],
    affectedStations: [...new Set(affectedStations)],
    publishedAt
  }
}

export function formatAlertType(type: AlertType): string {
  const labels: Record<AlertType, string> = {
    suspension: '🚫 Service Suspended',
    delay: '⏰ Delay',
    closure: '🔒 Station Closed',
    schedule: '📋 Schedule Change',
    other: '📢 Alert'
  }
  return labels[type]
}

export function formatSeverity(severity: Severity): string {
  const labels: Record<Severity, string> = {
    critical: 'Critical',
    warning: 'Warning',
    info: 'Info'
  }
  return labels[severity]
}
