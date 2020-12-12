export class Neuron {
  /**
   * @param {Number} id
   * @param {Number} layer
   */
  constructor (id, layer) {
    this.id = id
    this.layer = layer
  }

  clone () {
    return new Neuron(this.id, this.layer)
  }

  serialize () {
    return {
      id: this.id,
      layer: this.layer
    }
  }

  static deserialize (data) {
    return new Neuron(data.id, data.layer)
  }
}

Neuron.INPUT = 0
Neuron.HIDDEN = 1
Neuron.OUTPUT = 2
