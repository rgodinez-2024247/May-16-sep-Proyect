import { useEffect, useMemo, useState } from 'react'

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return useMemo(() => {
    const diff = startOfDay(target).getTime() - startOfDay(now).getTime()
    const days = Math.round(diff / 86_400_000)
    if (days > 0) {
      return {
        kind: 'before' as const,
        days,
        label:
          days === 1
            ? 'Falta 1 día para tu día'
            : `Faltan ${days} días para tu día`,
      }
    }
    if (days === 0) {
      return { kind: 'today' as const, days: 0, label: 'Hoy es tu día, May' }
    }
    return {
      kind: 'after' as const,
      days,
      label: 'Felices 23, Marjorie',
    }
  }, [now, target])
}
