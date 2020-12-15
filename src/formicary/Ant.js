import { Brain } from '../neat/Brain.js'

/** @typedef {import('./Formicary.js').Formicary} Formicary */

export class Ant {
  /**
   * @param {Formicary} formicary
   * @param {Brain} [brain]
   */
  constructor (formicary, brain = null) {
    this.formicary = formicary

    this.x = 0
    this.y = 0
    this.direction = Math.random() * Math.PI * 2
    this.speed = 0.25
    this.cargo = null
    this.dead = false
    this.age = 10000
    this.fitness = 0

    this.traveled = 0
    this.travelThreshold = 0.5

    this.pickDropCooldown = 0
    this.pickDropTime = 25

    this.antennae = {
      left: { x: 0, y: 0 },
      right: { x: 0, y: 0 }
    }

    /** @type {number[]} */
    this.io = []

    if (!brain) {
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
    } else {
      this.brain = brain
    }
    this.updateAntenna()
  }

  update () {
    if (--this.age === 0) {
      this.die()
      return
    }

    this.updateAntenna()

    const leftFoodScent = this.formicary.getFoodScentFrom(this.antennae.left.x, this.antennae.left.y)
    const rightFoodScent = this.formicary.getFoodScentFrom(this.antennae.right.x, this.antennae.right.y)
    const leftTrailScent = this.formicary.getTrailScentFrom(this.antennae.left.x, this.antennae.left.y)
    const rightTrailScent = this.formicary.getTrailScentFrom(this.antennae.right.x, this.antennae.right.y)
    const anthillDirection = this.formicary.getAnthillDirectionFrom(this.x, this.y)
    const carrying = this.cargo ? 1 : 0

    const [hold, move, direction, pheromone] = this.brain.update(leftFoodScent, rightFoodScent, leftTrailScent, rightTrailScent, anthillDirection, carrying)

    this.io = [leftFoodScent, rightFoodScent, leftTrailScent, rightTrailScent, anthillDirection, carrying, hold, move, direction, pheromone]

    // Fitness metrics (per tick):
    const metrics = {
      // Alive
      alive: 0.01,
      // Is carrying
      carrying: 0, // 0.1,
      // Carrying inside the anthill
      carryingInside: 0, // 1.0,
      // Not carrying near pheromone (others)
      nearPheromone: 0, // 0.05,
      // Not carrying near pheromone (others)
      nearFood: 0.05,
      // Not carrying near pheromone (others)
      pickCargo: 50.0,
      // Drop cargo inside anthill
      dropCargo: 500.0
    }

    if (!this.dead) {
      this.fitness += metrics.alive
    }

    const { x, y } = this
    const insideAnthill = this.formicary.isInsideAnthill(x, y)

    if (this.pickDropCooldown-- <= 0) {
      if (this.cargo && hold < 0) {
        if (insideAnthill) {
          this.fitness += metrics.dropCargo
        } else {
          this.formicary.dropFoodAt(this.x, this.y, this.cargo)
        }

        this.cargo = null
        this.pickDropCooldown = this.pickDropTime
      } else if (!this.cargo && hold >= 0) {
        const food = this.formicary.pickFoodAt(this.x, this.y)
        if (food) {
          this.fitness += metrics.pickCargo
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
      this.formicary.dropPheromoneAt(this.x, this.y, 1, this)
    }

    if (this.cargo) {
      this.fitness += metrics.carrying

      if (insideAnthill) {
        this.fitness += metrics.carryingInside
      }
    }

    const pheromones = this.formicary.findPheromonesAround(x, y)
    for (const pheromone of pheromones) {
      if (pheromone.ant !== this) {
        this.fitness += metrics.nearPheromone
        break
      }
    }

    const foods = this.formicary.findPheromonesAround(x, y)
    if (foods.length > 0) {
      this.fitness += metrics.nearFood
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
