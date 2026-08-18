import { useRef } from 'react'

type Props = {
  open: boolean
  onOpen: () => void
}

export function Entrance({ open, onOpen }: Props) {
  const noRef = useRef<HTMLButtonElement>(null)
  const lastDodge = useRef(0)

  const dodgeNo = (event?: { clientX: number; clientY: number }) => {
    const btn = noRef.current
    if (!btn) return

    const now = performance.now()
    if (now - lastDodge.current < 70) return
    lastDodge.current = now

    const rect = btn.getBoundingClientRect()
    const w = rect.width
    const h = rect.height
    const pad = 16
    const maxX = Math.max(pad, window.innerWidth - w - pad)
    const maxY = Math.max(pad, window.innerHeight - h - pad)
    const cx = event?.clientX ?? rect.left + w / 2
    const cy = event?.clientY ?? rect.top + h / 2

    let x = rect.left
    let y = rect.top
    for (let i = 0; i < 16; i++) {
      const nx = pad + Math.random() * Math.max(1, maxX - pad)
      const ny = pad + Math.random() * Math.max(1, maxY - pad)
      const fromCursor = Math.hypot(nx + w / 2 - cx, ny + h / 2 - cy)
      const fromPrev = Math.hypot(nx - rect.left, ny - rect.top)
      if (fromCursor > 150 && fromPrev > 90) {
        x = nx
        y = ny
        break
      }
      x = nx
      y = ny
    }

    btn.style.position = 'fixed'
    btn.style.margin = '0'
    btn.style.zIndex = '90'
    btn.style.opacity = '1'
    btn.style.visibility = 'visible'
    btn.style.left = `${rect.left}px`
    btn.style.top = `${rect.top}px`
    btn.classList.add('is-dodging')
    requestAnimationFrame(() => {
      btn.style.left = `${x}px`
      btn.style.top = `${y}px`
    })
  }

  return (
    <div className={`entrance entrance-gift ${open ? 'is-leaving' : ''}`}>
      <div className="entrance-stage">
        <h1 className="entrance-title">
          <span>FELIZ CUMPLEAÑOS</span>
          <span className="entrance-title-baby">BABY</span>
        </h1>

        <div className="hero-cast">
          <img
            className="hearts-ring"
            src="/images/hearts-ring.png?v=3"
            alt=""
            aria-hidden
          />
          <img
            className="sanrio-group"
            src="/images/sanrio-group-transparent.png?v=11"
            alt="Personajes Sanrio"
          />
        </div>

        <p className="entrance-ask">¿Quieres ver el regalo que hice para ti?</p>

        <div className="entrance-choices">
          <button type="button" className="choice-btn choice-yes" onClick={onOpen}>
            Sí
          </button>
          <button
            ref={noRef}
            type="button"
            className="choice-btn choice-no"
            onMouseEnter={(e) => dodgeNo(e.nativeEvent)}
            onPointerMove={(e) => dodgeNo(e.nativeEvent)}
            onTouchStart={(e) => {
              e.preventDefault()
              const t = e.touches[0]
              dodgeNo(t)
            }}
            onFocus={() => dodgeNo()}
            onPointerDown={(e) => {
              e.preventDefault()
              dodgeNo(e.nativeEvent)
            }}
            onClick={(e) => e.preventDefault()}
          >
            No
          </button>
        </div>
      </div>
    </div>
  )
}
