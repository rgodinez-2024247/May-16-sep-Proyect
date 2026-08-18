import { useEffect, useState } from 'react'
import {
  characters,
  cats,
  letters,
  paintings,
  type CharacterGift,
} from '../data/content'

type Props = {
  gift: CharacterGift | null
  onClose: () => void
}

export function GiftModal({ gift, onClose }: Props) {
  const [phase, setPhase] = useState<'idle' | 'intro' | 'open'>('idle')

  useEffect(() => {
    if (!gift) {
      setPhase('idle')
      return
    }
    setPhase('intro')
    const t = window.setTimeout(() => setPhase('open'), 80)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [gift, onClose])

  if (!gift) return null

  const letter =
    gift.kind === 'letter'
      ? letters.find((l) => l.id === gift.letterId)
      : undefined

  if (gift.kind === 'letter' && letter) {
    return (
      <div
        className={`letter-reveal ${phase === 'open' ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={gift.giftLabel}
        onClick={onClose}
      >
        <div className="letter-stage" onClick={(e) => e.stopPropagation()}>
          <img
            className="letter-flowers letter-flowers-top"
            src="/images/letter-flowers-top.png"
            alt=""
            aria-hidden
          />
          <img
            className="letter-flowers letter-flowers-bot"
            src="/images/letter-flowers-bot.png"
            alt=""
            aria-hidden
          />

          <article className="letter-paper">
            <p className="letter-paper-from">{gift.name} te trae…</p>
            <h3 className="letter-paper-title">{letter.title}</h3>
            <div className="letter-paper-body">{letter.body}</div>
          </article>

          <button type="button" className="letter-close soft" onClick={onClose}>
            Cerrar carta
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="gift-modal"
      role="dialog"
      aria-modal="true"
      aria-label={gift.giftLabel}
      onClick={onClose}
    >
      <div className="gift-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="gift-sheet-head">
          <img src={gift.src} alt="" className="gift-sheet-char" />
          <div>
            <p className="gift-from">{gift.name} te trae…</p>
            <h3>{gift.giftLabel}</h3>
          </div>
        </div>

        {gift.kind === 'paintings' && (
          <div className="gift-paint-grid">
            {paintings.map((p) => (
              <figure key={p.id}>
                <img src={p.src} alt={p.title} />
                <figcaption>
                  <strong>{p.title}</strong>
                  <span>{p.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {gift.kind === 'cats' && (
          <div className="gift-cat-grid">
            {cats.map((cat) => (
              <figure key={cat.id}>
                <img src={cat.src} alt={cat.name} />
                <figcaption>
                  <strong>{cat.name}</strong>
                  <span>{cat.line}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <button type="button" className="letter-close" onClick={onClose}>
          Cerrar regalo
        </button>
      </div>
    </div>
  )
}

export function CharacterGifts({
  onOpen,
}: {
  onOpen: (gift: CharacterGift) => void
}) {
  return (
    <section className="section gifts-section" id="regalos">
      <h2 className="section-title">Toca un personaje</h2>
      <p className="section-lead">Cada uno guarda un regalito para ti.</p>

      <div className="char-grid">
        {characters.map((ch) => (
          <button
            key={ch.id}
            type="button"
            className="char-btn"
            onClick={() => onOpen(ch)}
            aria-label={`${ch.name}: ${ch.giftLabel}`}
          >
            <img src={ch.src} alt={ch.name} />
            <span className="char-name">{ch.name}</span>
            <span className="char-gift">{ch.giftLabel}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
