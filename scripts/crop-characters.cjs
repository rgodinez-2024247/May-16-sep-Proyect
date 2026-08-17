const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

async function main() {
  const meta = await sharp('public/images/sanrio-sheet.png').metadata()
  const W = meta.width
  const H = meta.height
  const cols = 4
  const rows = 2
  const cw = Math.floor(W / cols)
  const ch = Math.floor(H / rows)

  const crops = [
    { name: 'cinnamoroll', col: 0, row: 0 },
    { name: 'hellokitty-walk', col: 1, row: 0 },
    { name: 'hellokitty-gift', col: 2, row: 0 },
    { name: 'badtzmaru', col: 0, row: 1 },
    { name: 'mymelody', col: 1, row: 1 },
    { name: 'kuromi', col: 2, row: 1 },
  ]

  const outDir = 'public/images/characters'
  fs.mkdirSync(outDir, { recursive: true })

  for (const c of crops) {
    const left = c.col * cw
    const top = c.row * ch
    // leave 1px slack on bottom/right edges (sharp/libvips edge case)
    const width = Math.min(cw, W - left - (c.col === cols - 1 ? 1 : 0))
    const height = Math.min(ch, H - top - (c.row === rows - 1 ? 1 : 0))
    await sharp('public/images/sanrio-sheet.png')
      .extract({ left, top, width, height })
      .trim({ threshold: 15 })
      .png()
      .toFile(path.join(outDir, `${c.name}.png`))
    console.log('ok', c.name, width, height)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
