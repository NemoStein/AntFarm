/* global Path2D */

import { CanvasRenderer, Hitzone } from './CanvasRenderer.js'

/** @typedef {import('../utils/Cursor.js').Cursor} Cursor */
/** @typedef {import('../neat/Brain.js').Brain} Brain */

export class ControlsRenderer extends CanvasRenderer {
  constructor (x, y, width, height) {
    super(x, y, width, height)

    /** @type {Brain} */
    this.brain = null

    const path = new Path2D()
    path.rect(0, 0, 120, 20)

    this.serialize = new Hitzone(path)
    this.serialize.action = () => console.log(JSON.stringify(this.brain?.serialize()))
    this.serialize.over = () => (document.body.style.cursor = 'pointer')
    this.serialize.out = () => (document.body.style.cursor = 'auto')

    this.hitzones.push(this.serialize)
  }

  render () {
    this.clear()
    this.drawButtons()
  }

  drawButtons () {
    this.context.fillStyle = '#eeeeee'
    this.context.strokeStyle = 'gray'

    this.context.fill(this.serialize.area)
    this.context.stroke(this.serialize.area)

    this.context.font = '9px sans-serif'
    this.context.textAlign = 'center'
    this.context.fillStyle = 'gray'
    this.context.fillText('serialize', 120 / 2, 20 / 2 + 3)
  }
}
