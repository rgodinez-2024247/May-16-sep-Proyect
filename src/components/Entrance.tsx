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
    const parent = btn.parentElement
    if (!parent) return
    const bounds = parent.getBoundingClientRect()
    const btnBox = btn.getBoundingClientRect()
    const maxX = Math.max(0, bounds.width - btnBox.width)
    const maxY = Math.max(0, 40)
    const x = Math.random() * maxX - maxX / 2
    const y = Math.random() * maxY
    btn.style.transform = `translate(${x}px, ${y}px)`
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
            onFocus={dodgeNo}
            onClick={dodgeNo}
          >
            No
          </button>
        </div>
      </div>
    </div>
  )
}
