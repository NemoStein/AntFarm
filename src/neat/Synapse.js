export class Synapse {
  /**
   * @param {Number} input
   * @param {Number} output
   * @param {Number} weight
   * @param {Number} innovation
   */
  constructor (input, output, weight, innovation) {
    this.input = input
    this.output = output
    this.weight = weight
    this.expressed = true
    this.innovation = innovation
  }

  clone () {
    return new Synapse(this.input, this.output, this.weight, this.innovation)
  }

  serialize () {
    return {
      input: this.input,
      output: this.output,
      weight: this.weight,
      expressed: this.expressed,
      innovation: this.innovation
    }
  }
}
