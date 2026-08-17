import { useEffect, useState } from 'react'

type Dot = { id: number; left: number; top: number; size: number; opacity: number }

function makeDots(count: number): Dot[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 140,
    size: 2 + Math.random() * 2.5,
    opacity: 0.35 + Math.random() * 0.5,
  }))
}

export function Background() {
  const [dots] = useState(() => makeDots(48))
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * 0.35)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="bg-layers" aria-hidden>
      <div className="scroll-dots" style={{ transform: `translate3d(0, ${offset}px, 0)` }}>
        {dots.map((d) => (
          <span
            key={d.id}
            className="scroll-dot"
            style={{
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              opacity: d.opacity,
            }}
          />
        ))}
      </div>
    </div>
  )
}
