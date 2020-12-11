import { CanvasRenderer } from './CanvasRenderer.js'

/** @typedef {import('../ann/Formicary.js').Formicary} Formicary */

export class FormicaryRenderer extends CanvasRenderer {
  /**
   * @param {Formicary} formicary
   */
  render (formicary) {
    this.clear()

    this.context.strokeStyle = 'black'
    this.context.strokeRect(0, 0, formicary.width, formicary.height)

    const anthillPath = new window.Path2D()
    anthillPath.arc(formicary.anthill.x, formicary.anthill.y, formicary.anthill.radius, 0, Math.PI * 2)
    this.context.strokeStyle = 'blue'
    this.context.stroke(anthillPath)

    this.context.fillStyle = 'rgba(255, 0, 255, .2)'
    for (const { x, y } of formicary.pheromone) {
      this.context.fillRect(x - 1, y - 1, 2, 2)
    }

    this.context.fillStyle = 'brown'
    for (const { x, y } of formicary.food) {
      this.context.fillRect(x - 1, y - 1, 2, 2)
    }

    for (const ant of formicary.ants) {
      // '#c33', '#cc3', '#3c3', '#3cc', '#33c', '#c3c'
      this.context.fillStyle = ant.dead ? 'silver' : 'dimgray'
      this.context.fillRect(ant.x - 2, ant.y - 2, 4, 4)
      this.context.fillRect(ant.antennae.left.x - 1, ant.antennae.left.y - 1, 2, 2)
      this.context.fillRect(ant.antennae.right.x - 1, ant.antennae.right.y - 1, 2, 2)

      if (ant.cargo) {
        this.context.fillStyle = 'white'
        this.context.fillRect(ant.x - 1, ant.y - 1, 2, 2)
      }
    }
  }
}
