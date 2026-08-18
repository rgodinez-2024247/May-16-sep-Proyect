import { useState } from 'react'
import { Background } from './components/Background'
import { CharacterGifts, GiftModal } from './components/CharacterGifts'
import { Entrance } from './components/Entrance'
import { MusicPlayer } from './components/MusicPlayer'
import { PuzzleGame } from './components/PuzzleGame'
import { type CharacterGift } from './data/content'

export default function App() {
  const [opened, setOpened] = useState(false)
  const [showVeil, setShowVeil] = useState(false)
  const [activeGift, setActiveGift] = useState<CharacterGift | null>(null)

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
          <section className="hero cute-hero">
            <img
              className="hero-cat"
              src="/images/hero-cat.png"
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
          </section>

          <CharacterGifts onOpen={setActiveGift} />

          <PuzzleGame />

          <section className="section closing" id="cierre">
            <blockquote>Te quiero mi niña. Felices 23 May.</blockquote>
          </section>

          <MusicPlayer enabled={opened} />
          <GiftModal gift={activeGift} onClose={() => setActiveGift(null)} />
        </div>
      )}
    </>
  )
}
