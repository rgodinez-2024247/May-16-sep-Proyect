const { removeBackground } = require('@imgly/background-removal-node')
const sharp = require('sharp')
const path = require('path')

const jobs = [
  {
    src: 'public/images/characters/src/cinnamoroll.png',
    out: 'public/images/characters/cinnamoroll-party.png',
  },
  {
    src: 'public/images/characters/src/hellokitty.png',
    out: 'public/images/characters/hellokitty-party.png',
  },
  {
    src: 'public/images/characters/src/kuromi.png',
    out: 'public/images/characters/kuromi-party.png',
  },
]

async function main() {
  for (const job of jobs) {
    console.log('Removing background:', path.basename(job.out))
    const blob = await removeBackground(job.src, {
      output: { format: 'image/png', quality: 1 },
    })
    const buffer = Buffer.from(await blob.arrayBuffer())
    await sharp(buffer).trim({ threshold: 8 }).png().toFile(job.out)
    const meta = await sharp(job.out).metadata()
    console.log('ok', meta.width, 'x', meta.height, 'alpha', meta.hasAlpha)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
