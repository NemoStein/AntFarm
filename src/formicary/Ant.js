import { Brain } from '../neat/Brain.js'

/** @typedef {import('./Formicary.js').Formicary} Formicary */

export class Ant {
  /**
   * @param {Formicary} formicary
   */
  constructor (formicary) {
    this.formicary = formicary

    this.x = 0
    this.y = 0
    this.direction = Math.random() * Math.PI * 2
    this.speed = 0.25
    this.cargo = null
    this.dead = false

    this.traveled = 0
    this.travelThreshold = 0.5

    this.pickDropCooldown = 0
    this.pickDropTime = 25

    this.antennae = {
      left: { x: 0, y: 0 },
      right: { x: 0, y: 0 }
    }

    /**
     * Brain input (6)
     * - Left food scent
     * - Right food scent
     * - Left pheromone scent
     * - Right pheromone scent
     * - Anthill direction
     * - Carrying
     *
     * Brain output (3)
     * - Hold
     * - Move
     * - Direction
     * - Pheromone
     */
    this.brain = new Brain(6, 4)
    this.brain.addSynapseMutation()

    // for (let i = 0; i < 3; i++) {
    //   if (Math.random() < 0.75) {
    //     this.brain.addSynapse()
    //   } else {
    //     this.brain.addNeuron()
    //   }
    // }

    // for (const synapse of this.brain.synapses) {
    //   if (synapse.expressed) {
    //     console.log(`${synapse.input} -> ${synapse.output} (${synapse.innovation})`)
    //   }
    // }

    this.updateAntenna()
  }

  update () {
    this.updateAntenna()

    const leftFoodScent = this.formicary.getFoodScentFrom(this.antennae.left.x, this.antennae.left.y)
    const rightFoodScent = this.formicary.getFoodScentFrom(this.antennae.right.x, this.antennae.right.y)
    const leftTrailScent = this.formicary.getTrailScentFrom(this.antennae.left.x, this.antennae.left.y)
    const rightTrailScent = this.formicary.getTrailScentFrom(this.antennae.right.x, this.antennae.right.y)
    const anthillDirection = this.formicary.getAnthillDirectionFrom(this.x, this.y)
    const carrying = this.cargo ? 1 : 0

    const [hold, move, direction, pheromone] = this.brain.update(leftFoodScent, rightFoodScent, leftTrailScent, rightTrailScent, anthillDirection, carrying)

    // console.log(`
    //   Input:
    //     [0,1]    food: ${leftFoodScent.toFixed(5)}, ${rightFoodScent.toFixed(5)}
    //     [2,3]   trail: ${leftTrailScent.toFixed(5)}, ${rightTrailScent.toFixed(5)}
    //     [4]   anthill: ${anthillDirection.toFixed(5)},
    //     [5]  carrying: ${carrying.toFixed(5)}
    //   Output:
    //     [6]      hold: ${hold.toFixed(5)}
    //     [7]      move: ${move.toFixed(5)}
    //     [8] direction: ${direction.toFixed(5)}
    //     [9] pheromone: ${pheromone.toFixed(5)}
    // `)

    if (this.pickDropCooldown-- <= 0) {
      if (this.cargo && hold < 0) {
        this.formicary.dropFoodAt(this.x, this.y, this.cargo)
        this.cargo = null
        this.pickDropCooldown = this.pickDropTime
      } else if (!this.cargo && hold >= 0) {
        const food = this.formicary.pickFoodAt(this.x, this.y)
        if (food) {
          this.cargo = food
          this.pickDropCooldown = this.pickDropTime
        }
      }
    }

    this.direction += direction * Math.PI

    if (move >= 0) {
      const travelX = Math.cos(this.direction) * this.speed
      const travelY = Math.sin(this.direction) * this.speed
      this.traveled += travelX ** 2 + travelY ** 2

      this.x += travelX
      this.y += travelY

      if (this.x <= 0 || this.x >= this.formicary.width || this.y <= 0 || this.y >= this.formicary.height) {
        this.die()
      }
    }

    if (Math.random() < pheromone && this.traveled > this.travelThreshold) {
      this.traveled -= this.travelThreshold
      this.formicary.dropPheromoneAt(this.x, this.y, 1)
    }
  }

  updateAntenna () {
    const antennaeLength = 6

    const left = this.direction - Math.PI / 6
    this.antennae.left.x = this.x + Math.cos(left) * antennaeLength
    this.antennae.left.y = this.y + Math.sin(left) * antennaeLength

    const right = this.direction + Math.PI / 6
    this.antennae.right.x = this.x + Math.cos(right) * antennaeLength
    this.antennae.right.y = this.y + Math.sin(right) * antennaeLength
  }

  die () {
    this.dead = true
  }
}
