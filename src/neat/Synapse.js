export class Synapse {
  /**
   * @param {Number} input
   * @param {Number} output
   * @param {Number} weight
   * @param {Number} innovation
   * @param {boolean} expressed
   */
  constructor (input, output, weight, innovation, expressed = true) {
    this.input = input
    this.output = output
    this.weight = weight
    this.innovation = innovation
    this.expressed = expressed
  }

  clone () {
    return new Synapse(this.input, this.output, this.weight, this.innovation, this.expressed)
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

  static deserialize (data) {
    return new Synapse(data.input, data.output, data.weight, data.innovation, data.expressed)
  }
}
