import { useEffect, useRef, useState } from 'react'
import { songs } from '../data/content'

type Props = {
  enabled: boolean
}

export function MusicPlayer({ enabled }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState(false)
  const track = songs[index]

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audioRef.current = audio

    const onEnded = () => setIndex((i) => (i + 1) % songs.length)
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
    // Autoplay only after user opened the gift (enabled=true from click)
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
    setIndex((i) => (i + dir + songs.length) % songs.length)
  }

  if (!enabled) return null

  return (
    <div className="music-dock" role="region" aria-label="Reproductor de música">
      <div className="music-top">
        <div className="music-meta">
          <strong>{track.title}</strong>
          <span>
            {index + 1} / {songs.length}
          </span>
        </div>
        <div className="music-controls">
          <button type="button" onClick={() => skip(-1)} aria-label="Anterior">
            ‹
          </button>
          <button type="button" onClick={() => void toggle()} aria-label={playing ? 'Pausa' : 'Play'}>
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
  )
}
