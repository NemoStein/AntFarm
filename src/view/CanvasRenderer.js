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
  }

  clear () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}
