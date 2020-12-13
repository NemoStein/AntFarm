/* global Path2D */

import { CanvasRenderer, Hitzone } from './CanvasRenderer.js'

/** @typedef {import('../utils/Cursor.js').Cursor} Cursor */
/** @typedef {import('../neat/Brain.js').Brain} Brain */

export class ControlsRenderer extends CanvasRenderer {
  constructor (x, y, width, height) {
    super(x, y, width, height)

    /** @type {Brain} */
    this.brain = null
    this.speed = 1

    this.speed0 = this.buildButton(0, 0, 20, 20, () => (this.speed = 0))
    this.speed1 = this.buildButton(30, 0, 20, 20, () => (this.speed = 1))
    this.speed2 = this.buildButton(60, 0, 20, 20, () => (this.speed = 10))
    this.speed3 = this.buildButton(90, 0, 20, 20, () => (this.speed = 100))
    this.serialize = this.buildButton(120, 0, 120, 20, () => console.log(JSON.stringify(this.brain?.serialize())))
  }

  buildButton (x, y, width, height, action) {
    const path = new Path2D()
    path.rect(x, y, width, height)

    const hitzone = new Hitzone(path, action)
    this.hitzones.push(hitzone)

    return hitzone
  }

  render () {
    this.clear()
    this.drawButtons()
  }

  drawButtons () {
    const buttons = {
      x0: this.speed0,
      x1: this.speed1,
      x10: this.speed2,
      x100: this.speed3,
      serialize: this.serialize
    }

    let i = 0
    for (const key in buttons) {
      const button = buttons[key]

      this.context.fillStyle = '#eeeeee'
      this.context.strokeStyle = 'gray'

      this.context.fill(button.area)
      this.context.stroke(button.area)

      this.context.font = '9px sans-serif'
      this.context.fillStyle = 'gray'
      this.context.fillText(key, 30 * i++ + 2, 20 / 2 + 3)
    }
  }
}
