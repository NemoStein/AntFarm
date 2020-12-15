/** @typedef {import('./Ant.js').Ant} Ant */

export class Pheromone {
  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} scent
   * @param {Ant} ant
   */
  constructor (x, y, scent, ant) {
    this.x = x
    this.y = y
    this.scent = scent
    this.ant = ant
  }
}
