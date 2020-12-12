import { Point } from './Point.js'

export class Cursor extends Point {
  constructor () {
    super()

    /** @type {Point} */
    this.pressed = null

    /** @type {Point} */
    this.released = null
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  update (x, y) {
    this.x = x
    this.y = y
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  press (x, y) {
    this.pressed = new Point(x, y)
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  release (x, y) {
    this.released = new Point(x, y)
  }

  clear () {
    this.pressed = null
    this.released = null
  }
}
