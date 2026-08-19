const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

async function cutCat() {
  const src = 'public/images/hero-cat-src.png'
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const n = width * height
  const lum = (i) => (data[i] + data[i + 1] + data[i + 2]) / 3
  const sat = (i) => Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2])

  const isBg = (i) => {
    const L = lum(i)
    const S = sat(i)
    return L > 232 && S < 18
  }

  const outside = new Uint8Array(n)
  const stack = []
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const p = y * width + x
    if (outside[p]) return
    if (!isBg(p * 4)) return
    outside[p] = 1
    stack.push(p)
  }

  for (let x = 0; x < width; x++) {
    push(x, 0)
    push(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    push(0, y)
    push(width - 1, y)
  }

  while (stack.length) {
    const p = stack.pop()
    const x = p % width
    const y = (p / width) | 0
    push(x + 1, y)
    push(x - 1, y)
    push(x, y + 1)
    push(x, y - 1)
  }

  for (let p = 0; p < n; p++) {
    if (!outside[p]) continue
    data[p * 4 + 3] = 0
  }

  await sharp(data, { raw: { width, height, channels: 4 } })
    .trim()
    .png()
    .toFile('public/images/hero-cat.png')
  console.log('cat ready')
}

function tabSign(a, b) {
  return (a * 17 + b * 31) % 2 === 0 ? 1 : -1
}

function edgePath(x1, y1, x2, y2, tab) {
  const dx = x2 - x1
  const dy = y2 - y1
  if (tab === 0) return `L ${x2.toFixed(2)} ${y2.toFixed(2)} `
  const len = Math.hypot(dx, dy)
  const ux = dx / len
  const uy = dy / len
  const nx = -uy
  const ny = ux
  const s = tab
  const neck = len * 0.34
  const mid = len * 0.5
  const h = len * 0.2 * s
  const w = len * 0.12
  const p = (t, ox = 0, oy = 0) => {
    const x = x1 + ux * t + nx * ox
    const y = y1 + uy * t + ny * oy
    return `${x.toFixed(2)} ${y.toFixed(2)}`
  }
  return [
    `L ${p(neck)} `,
    `C ${p(neck + w * 0.15, h * 0.12)} ${p(mid - w, h * 0.72)} ${p(mid - w * 0.2, h)} `,
    `C ${p(mid, h * 1.18)} ${p(mid + w * 0.2, h)} ${p(mid + w, h * 0.72)} `,
    `C ${p(len - neck - w * 0.15, h * 0.12)} ${p(len - neck)} ${p(len - neck)} `,
    `L ${p(len)} `,
  ].join('')
}

function piecePath(c, r, cols, rows, x, y, cw, ch) {
  const x2 = x + cw
  const y2 = y + ch
  const top = r === 0 ? 0 : -tabSign(c, r - 1)
  const right = c === cols - 1 ? 0 : tabSign(c, r)
  const bottom = r === rows - 1 ? 0 : tabSign(c, r)
  const left = c === 0 ? 0 : -tabSign(c - 1, r)
  return (
    `M ${x.toFixed(2)} ${y.toFixed(2)} ` +
    edgePath(x, y, x2, y, top) +
    edgePath(x2, y, x2, y2, right) +
    edgePath(x2, y2, x, y2, bottom) +
    edgePath(x, y2, x, y, left) +
    'Z'
  )
}

async function cutPuzzle() {
  const src = 'public/images/puzzle-heart.png'
  const metaImg = await sharp(src).metadata()
  const width = metaImg.width
  const height = metaImg.height
  const COLS = 6
  const ROWS = 4
  const left = 8
  const top = 8
  const right = width - 72
  const bottom = height - 10
  const boardW = right - left
  const boardH = bottom - top
  const cw = boardW / COLS
  const ch = boardH / ROWS

  const outDir = 'public/images/puzzle-pieces'
  fs.mkdirSync(outDir, { recursive: true })
  const pieces = []

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const id = r * COLS + c
      const d = piecePath(c, r, COLS, ROWS, left + c * cw, top + r * ch, cw, ch)
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><path d="${d}" fill="#fff"/></svg>`
      const mask = await sharp(Buffer.from(svg), { density: 72 })
        .resize(width, height)
        .png()
        .toBuffer()
      const { data, info } = await sharp(src)
        .ensureAlpha()
        .composite([{ input: mask, blend: 'dest-in' }])
        .raw()
        .toBuffer({ resolveWithObject: true })

      let minX = info.width
      let minY = info.height
      let maxX = 0
      let maxY = 0
      for (let y = 0; y < info.height; y++) {
        for (let x = 0; x < info.width; x++) {
          const a = data[(y * info.width + x) * 4 + 3]
          if (a < 8) continue
          if (x < minX) minX = x
          if (y < minY) minY = y
          if (x > maxX) maxX = x
          if (y > maxY) maxY = y
        }
      }
      const pw = maxX - minX + 1
      const ph = maxY - minY + 1
      const crop = Buffer.alloc(pw * ph * 4)
      for (let y = 0; y < ph; y++) {
        const srcStart = ((minY + y) * info.width + minX) * 4
        data.copy(crop, y * pw * 4, srcStart, srcStart + pw * 4)
      }
      const out = path.join(outDir, `p${id}.png`)
      await sharp(crop, { raw: { width: pw, height: ph, channels: 4 } })
        .png()
        .toFile(out)
      if (id === 0) console.log('piece0 bbox', minX, minY, pw, ph)
      pieces.push({
        id,
        col: c,
        row: r,
        x: minX - left,
        y: minY - top,
        w: pw,
        h: ph,
        src: `/images/puzzle-pieces/p${id}.png`,
      })
    }
  }

  const meta = { cols: COLS, rows: ROWS, boardWidth: boardW, boardHeight: boardH, pieces }
  fs.writeFileSync(
    'src/data/puzzle.ts',
    `export const puzzle = ${JSON.stringify(meta, null, 2)} as const\n`,
  )
  console.log('puzzle pieces', pieces.length, 'board', boardW, boardH)
}

async function main() {
  if (fs.existsSync('public/images/hero-cat-src.png')) {
    await cutCat()
  } else {
    console.log('hero-cat-src.png missing, keeping current hero cat')
  }
  await cutPuzzle()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
