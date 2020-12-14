import { TestRenderer } from './TestRenderer.js'
import fs from 'fs'
import path from 'path'
import url from 'url'

/** @typedef {import('../src/neat/Brain').Brain} Brain */

/**
 * @param {Brain} brain
 * @param {string} name
 */
export const render = (brain, name) => {
  const renderer = new TestRenderer(500, 500)
  renderer.render(brain)

  const dirname = path.dirname(url.fileURLToPath(import.meta.url))
  fs.mkdir(`${dirname}/.images`, () => {
    const out = fs.createWriteStream(`${dirname}/.images/${name}.png`)
    const stream = renderer.canvas.createPNGStream()
    stream.pipe(out)
    out.on('finish', () => console.log(`The file ${name}.png was created.`))
  })
}
