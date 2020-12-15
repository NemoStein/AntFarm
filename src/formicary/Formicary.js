import { Ant } from './Ant.js'
import { Brain } from '../neat/Brain.js'
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
   * @param {Number} supply Amount of scattered food
   */
  constructor (width, height, anthillX, anthillY, anthillRadius, population, supply) {
    this.width = width
    this.height = height
    this.population = population
    this.supply = supply

    this.anthill = {
      x: anthillX,
      y: anthillY,
      radius: anthillRadius
    }

    this.pickupRange = 2.5
    this.nearRange = 10

    /** @type {Food[]} */
    this.foods = []

    /** @type {Pheromone[]} */
    this.pheromones = []

    /** @type {Ant[]} */
    this.ants = []

    this.reset(true)

    while (population-- > 0) {
      this.addAnt(new Ant(this))
    }
  }

  reset (resuply) {
    this.ants.length = 0
    this.foods.length = 0
    this.pheromones.length = 0

    if (resuply) {
      let supply = this.supply
      while (supply--) {
        this.dropFoodAt(Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height), Math.random() * 50 + 50)
      }
    }
  }

  /**
   * @param {Ant} ant
   */
  addAnt (ant) {
    ant.x = this.anthill.x
    ant.y = this.anthill.y
    ant.update()

    this.ants.push(ant)
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  getFoodScentFrom (x, y) {
    let scent = 0
    for (const item of this.foods) {
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
    for (const item of this.pheromones) {
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
    this.foods.push(new Food(x, y, scent))
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {number} scent
   * @param {Ant} ant
   */
  dropPheromoneAt (x, y, scent, ant) {
    this.pheromones.push(new Pheromone(x, y, scent, ant))
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @returns {Number} Scent
   */
  pickFoodAt (x, y) {
    for (let i = 0; i < this.foods.length; i++) {
      const food = this.foods[i]
      if (Math.abs(food.x - x) ** 2 + Math.abs(food.y - y) ** 2 < this.pickupRange ** 2) {
        this.foods.splice(i, 1)
        return food.scent
      }
    }

    return 0
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @returns {Food[]} Pheromones
   */
  findFoodsAround (x, y) {
    const foods = []
    for (const food of this.foods) {
      if (Math.abs(food.x - x) ** 2 + Math.abs(food.y - y) ** 2 < this.nearRange ** 2) {
        foods.push(food)
      }
    }

    return foods
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @returns {Pheromone[]} Pheromones
   */
  findPheromonesAround (x, y) {
    const pheromones = []
    for (const pheromone of this.pheromones) {
      if (Math.abs(pheromone.x - x) ** 2 + Math.abs(pheromone.y - y) ** 2 < this.nearRange ** 2) {
        pheromones.push(pheromone)
      }
    }

    return pheromones
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  isInsideAnthill (x, y) {
    return this.distanceSquaredFromAnthill(x, y) < this.anthill.radius ** 2
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  distanceSquaredFromAnthill (x, y) {
    return Math.abs(this.anthill.x - x) ** 2 + Math.abs(this.anthill.y - y) ** 2
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
    const [parent1, parent2] = [...this.ants].sort((a, b) => b.fitness - a.fitness)

    this.reset(true)

    for (let i = 0; i < this.population; i++) {
      const ant = new Ant(this, Brain.crossover(parent1.brain, parent2.brain))

      if (Math.random() < 0.1) {
        if (Math.random() < 0.65) {
          ant.brain.addNeuronMutation()
        } else {
          ant.brain.addSynapseMutation()
        }
      }

      this.addAnt(ant)
    }
  }

  /**
   * @returns {Ant}
   */
  getFittest () {
    let fittest
    let fitness = -Infinity
    for (const ant of this.ants) {
      if (ant.fitness > fitness) {
        fittest = ant
        fitness = ant.fitness
      }
    }

    return fittest
  }
}
