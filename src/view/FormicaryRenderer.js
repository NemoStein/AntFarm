/* global Path2D */
import { CanvasRenderer, Hitzone } from './CanvasRenderer.js'

/** @typedef {import('../formicary/Formicary.js').Formicary} Formicary */

export class FormicaryRenderer extends CanvasRenderer {
  constructor (x, y, width, height) {
    super(x, y, width, height)

    const path = new Path2D()
    path.rect(0, 0, width, height)

    this.findAnt = new Hitzone(path, cursor => (this.selectedAnt = this.findAntNear(cursor.x - this.x, cursor.y - this.y)))

    this.hitzones.push(this.findAnt)
  }

  /**
   * @param {Formicary} formicary
   */
  render (formicary) {
    this.formicary = formicary
    this.clear()

    this.context.strokeStyle = 'black'
    this.context.strokeRect(0, 0, formicary.width, formicary.height)

    const anthillPath = new window.Path2D()
    anthillPath.arc(formicary.anthill.x, formicary.anthill.y, formicary.anthill.radius, 0, Math.PI * 2)
    this.context.strokeStyle = 'blue'
    this.context.stroke(anthillPath)

    this.context.fillStyle = 'rgba(255, 0, 255, .2)'
    for (const { x, y } of formicary.pheromones) {
      this.context.fillRect(x - 1, y - 1, 2, 2)
    }

    this.context.fillStyle = 'brown'
    for (const { x, y, scent } of formicary.foods) {
      const size = (scent - 50) / (100 - 50) * 2 + 1
      this.context.fillRect(x - size * 0.5, y - size * 0.5, size, size)
    }

    for (const ant of formicary.ants) {
      // '#c33', '#cc3', '#3c3', '#3cc', '#33c', '#c3c'
      this.context.fillStyle = ant.dead ? 'silver' : 'dimgray'
      this.context.fillRect(ant.x - 2, ant.y - 2, 4, 4)
      this.context.fillRect(ant.antennae.left.x - 1, ant.antennae.left.y - 1, 2, 2)
      this.context.fillRect(ant.antennae.right.x - 1, ant.antennae.right.y - 1, 2, 2)

      if (ant === this.selectedAnt) {
        this.context.fillStyle = 'rgba(0, 0, 127, 0.1)'
        this.context.beginPath()
        this.context.arc(ant.x, ant.y, 8, 0, Math.PI * 2)
        this.context.fill()
      }

      if (ant.cargo) {
        this.context.fillStyle = 'white'
        this.context.fillRect(ant.x - 1, ant.y - 1, 2, 2)
      }
    }
  }

  findAntNear (x, y) {
    const radius = 8
    for (const ant of this.formicary.ants) {
      if (
        ant.x - radius <= x &&
        ant.x + radius >= x &&
        ant.y - radius <= y &&
        ant.y + radius >= y
      ) {
        return ant
      }
    }
  }
}
