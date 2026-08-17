const sharp = require('sharp')

/**
 * Remove baked checkerboard from Sanrio group JPEG,
 * keeping characters (incl. white faces) via sealed outline barriers.
 */
async function main() {
  const { data, info } = await sharp('public/images/sanrio-group.png')
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height } = info
  const n = width * height
  const orig = Buffer.from(data)

  const lum = (i) => (orig[i] + orig[i + 1] + orig[i + 2]) / 3
  const sat = (i) => {
    const r = orig[i]
    const g = orig[i + 1]
    const b = orig[i + 2]
    return Math.max(r, g, b) - Math.min(r, g, b)
  }

  // Strict character ink/color
  const ink = new Uint8Array(n)
  for (let p = 0; p < n; p++) {
    const i = p * 4
    if (sat(i) > 30 || lum(i) < 95) ink[p] = 1
  }

  // Dilate ink → solid barrier to seal outline gaps
  const barrier = new Uint8Array(n)
  const dilate = 4
  for (let p = 0; p < n; p++) {
    if (!ink[p]) continue
    const x = p % width
    const y = (p / width) | 0
    for (let dy = -dilate; dy <= dilate; dy++) {
      for (let dx = -dilate; dx <= dilate; dx++) {
        if (dx * dx + dy * dy > dilate * dilate + 1) continue
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
        barrier[ny * width + nx] = 1
      }
    }
  }

  // Checker / empty paper (includes white squares of the grid and soft grey mess)
  const isBg = (i) => {
    const L = lum(i)
    const S = sat(i)
    if (S < 18 && L >= 160) return true // checker white+grey + wispy top
    if (S < 22 && L >= 140 && L < 160) return true // soft shadow greys
    return false
  }

  // Flood background from edges; cannot cross barrier
  const kill = new Uint8Array(n)
  const stack = []
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const p = y * width + x
    if (kill[p] || barrier[p]) return
    const i = p * 4
    if (!isBg(i)) return
    kill[p] = 1
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

  // Also kill any remaining checker islands not inside barrier-dilated character body:
  // grow "keep" from ink through pale fills, then kill everything else bg-like
  const keep = new Uint8Array(n)
  let frontier = []
  for (let p = 0; p < n; p++) {
    if (!ink[p]) continue
    keep[p] = 1
    frontier.push(p)
  }

  const paleFill = (i) => {
    const L = lum(i)
    const S = sat(i)
    return S < 28 && L > 200
  }

  for (let step = 0; step < 70; step++) {
    const next = []
    for (const p of frontier) {
      const x = p % width
      const y = (p / width) | 0
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
        const np = ny * width + nx
        if (keep[np] || kill[np]) continue
        if (!paleFill(np * 4)) continue
        keep[np] = 1
        next.push(np)
      }
    }
    frontier = next
    if (!frontier.length) break
  }

  // Compose output
  for (let p = 0; p < n; p++) {
    const i = p * 4
    if (keep[p]) {
      let r = orig[i]
      let g = orig[i + 1]
      let b = orig[i + 2]
      const L = (r + g + b) / 3
      const S = Math.max(r, g, b) - Math.min(r, g, b)
      // clean white faces/paws
      if (S < 24 && L > 200) {
        r = g = b = 255
      }
      data[i] = r
      data[i + 1] = g
      data[i + 2] = b
      data[i + 3] = 255
    } else {
      data[i + 3] = 0
    }
  }

  await sharp(data, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 0 })
    .png()
    .toFile('public/images/sanrio-group-transparent.png')

  const meta = await sharp('public/images/sanrio-group-transparent.png').metadata()
  console.log('wrote', meta.width, meta.height, 'hasAlpha', meta.hasAlpha)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
