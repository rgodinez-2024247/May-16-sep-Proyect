const sharp = require('sharp')

async function main() {
  const img = sharp('public/images/sanrio-sheet.png')
  const meta = await img.metadata()
  console.log(meta)

  const jobs = [
    { name: 'badtzmaru', left: 0, top: 223 },
    { name: 'mymelody', left: 139, top: 223 },
    { name: 'kuromi', left: 278, top: 223 },
  ]

  for (const j of jobs) {
    const height = meta.height - j.top - 1
    const width = Math.min(139, meta.width - j.left - 1)
    console.log(j.name, j.left, j.top, width, height)
    await sharp('public/images/sanrio-sheet.png')
      .extract({ left: j.left, top: j.top, width, height })
      .trim({ threshold: 15 })
      .png()
      .toFile(`public/images/characters/${j.name}.png`)
    console.log('ok', j.name)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
