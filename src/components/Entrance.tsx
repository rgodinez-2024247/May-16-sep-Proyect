import { useRef } from 'react'

type Props = {
  open: boolean
  onOpen: () => void
}

export function Entrance({ open, onOpen }: Props) {
  const noRef = useRef<HTMLButtonElement>(null)

  const dodgeNo = () => {
    const btn = noRef.current
    if (!btn) return
    const pad = 16
    const w = btn.offsetWidth
    const h = btn.offsetHeight
    const maxX = Math.max(pad, window.innerWidth - w - pad)
    const maxY = Math.max(pad, window.innerHeight - h - pad)
    const x = pad + Math.random() * (maxX - pad)
    const y = pad + Math.random() * (maxY - pad)
    btn.classList.add('is-dodging')
    btn.style.left = `${x}px`
    btn.style.top = `${y}px`
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
            onMouseEnter={dodgeNo}
            onTouchStart={(e) => {
              e.preventDefault()
              dodgeNo()
            }}
            onFocus={dodgeNo}
            onClick={(e) => {
              e.preventDefault()
              dodgeNo()
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  )
}
