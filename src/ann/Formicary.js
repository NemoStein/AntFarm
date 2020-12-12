import { Ant } from './Ant.js'
import { Food } from './Food.js'
import { Pheromone } from './Pheromone.js'

export class Formicary {
  /**
   * @param {Number} width Width of the formicary
   * @param {Number} height Height of the formicary
   * @param {Number} anthillX X position of the anthill
   * @param {Number} anthillY Y position of the anthill
   * @param {Number} anthillRadius Radius of the anthill
   * @param {Number} population Size of the population
   */
  constructor (width, height, anthillX, anthillY, anthillRadius, population) {
    this.width = width
    this.height = height
    this.population = population

    this.anthill = {
      x: anthillX,
      y: anthillY,
      radius: anthillRadius
    }

    this.pickupRange = 2.5

    /** @type {Food[]} */
    this.food = []

    /** @type {Pheromone[]} */
    this.pheromone = []

    /** @type {Ant[]} */
    this.ants = []

    while (population-- > 0) {
      const ant = new Ant(this)

      ant.x = this.anthill.x
      ant.y = this.anthill.y
      ant.update()

      this.ants.push(ant)
    }
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  getFoodScentFrom (x, y) {
    let scent = 0
    for (const item of this.food) {
      const squareDistance = Math.abs(item.x - x) ** 2 + Math.abs(item.y - y) ** 2
      scent += item.scent / squareDistance
    }

    return scent
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  getTrailScentFrom (x, y) {
    let scent = 0
    for (const item of this.pheromone) {
      const squareDistance = Math.abs(item.x - x) ** 2 + Math.abs(item.y - y) ** 2
      scent += item.scent / squareDistance
    }

    return scent
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  getAnthillDirectionFrom (x, y) {
    return Math.atan2(this.anthill.y - y, this.anthill.x - x)
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {number} scent
   */
  dropFoodAt (x, y, scent) {
    this.food.push(new Food(x, y, scent))
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {number} scent
   */
  dropPheromoneAt (x, y, scent) {
    this.pheromone.push(new Pheromone(x, y, scent))
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @returns {Number} Scent
   */
  pickFoodAt (x, y) {
    for (let i = 0; i < this.food.length; i++) {
      const food = this.food[i]
      if (Math.abs(food.x - x) ** 2 + Math.abs(food.y - y) ** 2 < this.pickupRange ** 2) {
        this.food.splice(i, 1)
        return food.scent
      }
    }

    return 0
  }

  update () {
    let allDead = true
    for (const ant of this.ants) {
      if (!ant.dead) {
        allDead = false
        ant.update()
      }
    }

    if (allDead) {
      this.endCurrentGeneration()
    }
  }

  endCurrentGeneration () {

  }

  /**
   * @returns {Ant}
   */
  getFittest () {
    return this.ants[0]
  }
}
