import { useEffect, useMemo, useRef, useState } from 'react'
import { puzzle } from '../data/puzzle'

type DragState = {
  id: number
  x: number
  y: number
  grabX: number
  grabY: number
}

type PieceMeta = {
  id: number
  col: number
  row: number
  x: number
  y: number
  w: number
  h: number
  src: string
}

const pieces: PieceMeta[] = puzzle.pieces.map((p) => ({ ...p }))

export function PuzzleGame() {
  const boardRef = useRef<HTMLDivElement>(null)
  const liveRef = useRef({ placed: new Set<number>() })
  const [placed, setPlaced] = useState<Set<number>>(() => new Set())
  const [drag, setDrag] = useState<DragState | null>(null)
  const [order] = useState(() => {
    const ids = pieces.map((p) => p.id)
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[ids[i], ids[j]] = [ids[j], ids[i]]
    }
    return ids
  })

  liveRef.current.placed = placed
  const metaById = useMemo(() => new Map(pieces.map((p) => [p.id, p])), [])
  const done = placed.size === pieces.length

  const pieceSize = (id: number) => {
    const board = boardRef.current
    const meta = metaById.get(id)
    if (!board || !meta) return 96
    return (meta.w / puzzle.boardWidth) * board.clientWidth
  }

  const onDown = (event: React.PointerEvent<HTMLElement>, id: number) => {
    if (liveRef.current.placed.has(id)) return
    const target = event.currentTarget.getBoundingClientRect()
    event.currentTarget.setPointerCapture(event.pointerId)
    setDrag({
      id,
      x: target.left,
      y: target.top,
      grabX: event.clientX - target.left,
      grabY: event.clientY - target.top,
    })
  }

  useEffect(() => {
    if (!drag) return

    const onMove = (event: PointerEvent) => {
      setDrag((d) =>
        d
          ? {
              ...d,
              x: event.clientX - d.grabX,
              y: event.clientY - d.grabY,
            }
          : d,
      )
    }

    const onUp = () => {
      setDrag((d) => {
        if (!d) return null
        const board = boardRef.current
        const meta = metaById.get(d.id)
        if (!board || !meta) return null
        const b = board.getBoundingClientRect()
        const scale = b.width / puzzle.boardWidth
        const targetX = b.left + meta.x * scale
        const targetY = b.top + meta.y * scale
        const dist = Math.hypot(d.x - targetX, d.y - targetY)
        if (dist < Math.max(24, meta.w * scale * 0.3)) {
          setPlaced((prev) => {
            const next = new Set(prev)
            next.add(d.id)
            return next
          })
        }
        return null
      })
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [drag, metaById])

  const renderPiece = (id: number, where: 'board' | 'tray' | 'float') => {
    const meta = metaById.get(id)
    if (!meta) return null
    const locked = placed.has(id)
    if (where === 'board' && !locked) return null
    if (where === 'tray' && (locked || drag?.id === id)) return null
    if (where === 'float' && drag?.id !== id) return null

    const style =
      where === 'board'
        ? {
            left: `${(meta.x / puzzle.boardWidth) * 100}%`,
            top: `${(meta.y / puzzle.boardHeight) * 100}%`,
            width: `${(meta.w / puzzle.boardWidth) * 100}%`,
          }
        : where === 'float'
          ? {
              left: drag ? `${drag.x}px` : 0,
              top: drag ? `${drag.y}px` : 0,
              width: `${pieceSize(id)}px`,
            }
          : {
              width: '92px',
            }

    return (
      <img
        key={`${where}-${id}`}
        src={meta.src}
        alt=""
        draggable={false}
        className={`puzzle-drag is-${where} ${locked ? 'is-placed' : ''}`}
        style={style}
        onPointerDown={where === 'tray' ? (e) => onDown(e, id) : undefined}
      />
    )
  }

  return (
    <section className="section puzzle-play" id="puzzle">
      <h2 className="section-title">Arma el rompecabezas</h2>
      <p className="section-lead">Arrastra cada pieza al recuadro hasta que encaje.</p>

      <div
        className="puzzle-board"
        ref={boardRef}
        style={{ aspectRatio: `${puzzle.boardWidth} / ${puzzle.boardHeight}` }}
      >
        {pieces.map((p) => renderPiece(p.id, 'board'))}
        {done && <p className="puzzle-done">Lo armaste, mi niña.</p>}
      </div>

      <div className="puzzle-tray">
        {order.map((id) => renderPiece(id, 'tray'))}
      </div>

      {drag ? renderPiece(drag.id, 'float') : null}
    </section>
  )
}
