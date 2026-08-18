import { useEffect, useRef, useState } from 'react'
import { songs } from '../data/content'

type Props = {
  enabled: boolean
}

function shuffledOrder() {
  const order = songs.map((_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

export function MusicPlayer({ enabled }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [order] = useState(() => shuffledOrder())
  const [cursor, setCursor] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState(false)
  const index = order[cursor] ?? 0
  const track = songs[index]

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audioRef.current = audio

    const onEnded = () => setCursor((c) => (c + 1) % songs.length)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.pause()
      audio.removeEventListener('ended', onEnded)
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    let cancelled = false
    setPlaying(false)
    audio.pause()
    audio.src = track.file

    audio.load()

    const probe = async () => {
      try {
        const res = await fetch(track.file, { method: 'HEAD' })
        if (!cancelled) setAvailable(res.ok)
      } catch {
        if (!cancelled) setAvailable(false)
      }
    }
    void probe()

    return () => {
      cancelled = true
    }
  }, [track.file])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !enabled || !available) return
    void audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }, [enabled, available, track.file])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio || !available) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    }
  }

  const skip = (dir: -1 | 1) => {
    setCursor((c) => (c + dir + songs.length) % songs.length)
  }

  if (!enabled) return null

  return (
    <div className="music-dock" role="region" aria-label="Reproductor de música">
      <div className="music-note" aria-hidden>
        ♪
      </div>
      <div className="music-body">
        <div className="music-top">
          <div className="music-meta">
            <strong>{track.title}</strong>
            <span>
              {cursor + 1} / {songs.length}
            </span>
          </div>
          <div className="music-controls">
            <button type="button" onClick={() => skip(-1)} aria-label="Anterior">
              ‹
            </button>
            <button
              type="button"
              className="music-play"
              onClick={() => void toggle()}
              aria-label={playing ? 'Pausa' : 'Play'}
            >
              {playing ? '❚❚' : '▶'}
            </button>
            <button type="button" onClick={() => skip(1)} aria-label="Siguiente">
              ›
            </button>
          </div>
        </div>
        {!available && (
          <p className="music-hint">La música se activará cuando estén los archivos en /public/music</p>
        )}
      </div>
    </div>
  )
}
