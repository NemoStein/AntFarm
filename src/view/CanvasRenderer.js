/** @typedef {import('../utils/Cursor.js').Cursor} Cursor */

export class CanvasRenderer {
  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   */
  constructor (x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height

    this.context = this.canvas.getContext('2d')

    /** @type {Hitzone[]} */
    this.hitzones = []
  }

  clear () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  /**
   * @param {Cursor} cursor
   */
  update (cursor) {
    for (const hitzone of this.hitzones) {
      if (this.context.isPointInPath(hitzone.area, cursor.x - this.x, cursor.y - this.y)) {
        hitzone.over?.(cursor)

        if (
          cursor.pressed &&
          cursor.released &&
          this.context.isPointInPath(hitzone.area, cursor.pressed.x - this.x, cursor.pressed.y - this.y) &&
          this.context.isPointInPath(hitzone.area, cursor.released.x - this.x, cursor.released.y - this.y)
        ) {
          hitzone.action?.(cursor)
        }
      } else {
        hitzone.out?.(cursor)
      }
    }
  }
}

export class Hitzone {
  /**
   * @param {Path2D} area
   */
  constructor (area) {
    this.area = area

    /** @type {Function} */
    this.over = null

    /** @type {Function} */
    this.out = null

    /** @type {Function} */
    this.action = null
  }
}
