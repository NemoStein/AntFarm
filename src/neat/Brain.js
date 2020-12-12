import { List } from '../utils/List.js'
import { Neuron } from './Neuron.js'
import { Synapse } from './Synapse.js'

let currentInnovation = 0

export class Brain {
  /**
   * @param {number} inputSize
   * @param {number} outputSize
   */
  constructor (inputSize, outputSize) {
    this.inputSize = inputSize
    this.outputSize = outputSize

    /** @type {Neuron[]} */
    this.neurons = []

    /** @type {Synapse[]} */
    this.synapses = []

    for (let i = 0; i < inputSize; i++) {
      this.neurons.push(new Neuron(this.neurons.length, Neuron.INPUT))
    }

    for (let i = 0; i < outputSize; i++) {
      this.neurons.push(new Neuron(this.neurons.length, Neuron.OUTPUT))
    }
  }

  /**
   * @param {Number} x
   */
  sigmoid (x) {
    // 1.618 ~= Phi, Golden Ration
    return (1 / (1 + 1.618 ** -x)) * 2 - 1
  }

  /**
   * @param  {...Number} inputs
   * @returns {Number[]}
   */
  update (...inputs) {
    if (inputs.length !== this.inputSize) {
      throw new Error('Inputs count must match input neurons count')
    }

    const openList = new List()
    for (let i = 0; i < this.inputSize; i++) {
      openList.add(this.neurons[i].id)
    }

    for (const activation of openList) {
      for (const synapse of this.synapses) {
        if (synapse.expressed && synapse.input === activation) {
          openList.add(synapse.output)
        }
      }
    }

    let track = openList.tail
    while (track) {
      let check = track.prev
      while (check) {
        if (check.value === track.value) {
          check.remove()
        }
        check = check.prev
      }
      track = track.prev
    }

    // Setting all input neurons to its values and all other neurons to zero
    const values = new Array(this.neurons.length)
    for (let i = 0; i < values.length; i++) {
      values[i] = (i < inputs.length ? inputs[i] : 0)
    }

    let geneLink = openList.head
    while (geneLink) {
      const id = geneLink.value

      for (const synapse of this.synapses) {
        if (synapse.output === id) {
          values[synapse.output] += values[synapse.input] * synapse.weight
        }
      }

      values[id] = this.sigmoid(values[id])
      geneLink = geneLink.next
    }

    const output = []
    for (let i = 0; i < this.outputSize; i++) {
      output.push(this.sigmoid(values[this.inputSize + i]))
    }

    return output
  }

  addNeuron () {
    // Disabling a random expressed connection
    let synapse

    do {
      synapse = this.synapses[Math.floor(Math.random() * this.synapses.length)]
    }
    while (!synapse.expressed)

    synapse.expressed = false

    // Creating a new Node and 2 new connections to replace the old connection
    const neuron = new Neuron(this.neurons.length, Neuron.HIDDEN)
    this.neurons.push(neuron)
    this.synapses.push(new Synapse(synapse.input, neuron.id, 1, currentInnovation))
    this.synapses.push(new Synapse(neuron.id, synapse.output, synapse.weight, currentInnovation))

    currentInnovation++
  }

  addSynapse () {
    let loopAttemps = 10

    do {
      let input
      let output
      let validConnection
      let connectionAttempts = 10

      // Find unconnected neuron pair
      do {
        let inputIndex = Math.floor(Math.random() * (this.neurons.length - this.outputSize))
        const outputIndex = Math.floor(Math.random() * (this.neurons.length - this.inputSize) + this.inputSize)

        // Skipping output layer
        if (inputIndex > this.inputSize) {
          inputIndex += this.outputSize
        }

        // Picked same neuron - skip
        if (inputIndex === outputIndex) {
          continue
        }

        input = this.neurons[inputIndex]
        output = this.neurons[outputIndex]

        // Swap neurons if input layer is bigger than output layer
        if (input.layer > output.layer) {
          const swap = input
          input = output
          output = swap
        }

        // Input neuron can't be from output layer - skip
        if (input.layer === Neuron.OUTPUT) {
          continue
        }

        // Checking if connection between this neurons already exists
        validConnection = true
        for (const synapse of this.synapses) {
          if ((synapse.input === input.id && synapse.output === output.id) || (synapse.input === output.id && synapse.output === input.id)) {
            validConnection = false
            break
          }
        }
      }
      while (!validConnection && connectionAttempts--)

      if (validConnection) {
        const weight = Math.random() * 2 - 1
        const synapse = new Synapse(input.id, output.id, weight, currentInnovation++)

        // Check circular reference
        const checkList = /** @type {List<Synapse>} */ (new List())
        checkList.add(synapse)

        const lookup = synapse.output
        let node = checkList.head
        let loopFound = false

        do {
          for (const synapse of this.synapses) {
            if (synapse.output === node.value.input) {
              if (synapse.input === lookup) {
                loopFound = true
                break
              }

              checkList.add(synapse)
            }
          }

          if (loopFound) {
            break
          }

          node = node.next
        }
        while (node)

        if (!loopFound) {
          this.synapses.push(synapse)
          break
        }

        console.log(`Loop found at ${input.id} -> ${output.id}`)
      }
    }
    while (loopAttemps-- > 0)
  }

  clone () {
    const brain = new Brain(this.inputSize, this.outputSize)

    for (const neuron of this.neurons) {
      brain.neurons.push(neuron.clone())
    }

    for (const synapse of this.synapses) {
      brain.synapses.push(synapse.clone())
    }

    return brain
  }

  static crossover (parent1, parent2) {

  }
}
