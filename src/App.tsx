import { useState } from 'react'
import { Background } from './components/Background'
import { CharacterGifts, GiftModal } from './components/CharacterGifts'
import { Entrance } from './components/Entrance'
import { MusicPlayer } from './components/MusicPlayer'
import { BIRTHDAY, type CharacterGift } from './data/content'
import { useCountdown } from './hooks/useCountdown'

export default function App() {
  const [opened, setOpened] = useState(false)
  const [showVeil, setShowVeil] = useState(false)
  const [activeGift, setActiveGift] = useState<CharacterGift | null>(null)
  const countdown = useCountdown(BIRTHDAY)

  const handleOpen = () => {
    setOpened(true)
    setShowVeil(true)
    window.setTimeout(() => setShowVeil(false), 3200)
  }

  return (
    <>
      <Background />

      <Entrance open={opened} onOpen={handleOpen} />

      {showVeil && (
        <div className="opening-veil" aria-hidden>
          <p>Hola, Baby… esto es solo para ti.</p>
        </div>
      )}

      {opened && (
        <div className="app-shell">
          <header className="top-bar">
            <p className="countdown">
              <strong>{countdown.label}</strong>
            </p>
          </header>

          <section className="hero cute-hero">
            <img
              className="hero-deco"
              src="/images/characters/hellokitty-walk.png"
              alt=""
              aria-hidden
            />
            <h1>
              Feliz cumpleaños
              <br />
              <em>mi niña</em>
            </h1>
            <div className="heart-row" aria-hidden>
              <span>♥</span>
              <span>♥</span>
              <span>♥</span>
            </div>
            <p>Marjorie, te mereces flores en tu día especial.</p>
          </section>

          <CharacterGifts onOpen={setActiveGift} />

          <section className="section closing" id="cierre">
            <blockquote>Te quiero, mi niña. Feliz 23, Marjorie.</blockquote>
            <p className="sign">Si quieres, dime qué regalo te gustó más.</p>
          </section>

          <MusicPlayer enabled={opened} />
          <GiftModal gift={activeGift} onClose={() => setActiveGift(null)} />
        </div>
      )}
    </>
  )
}
