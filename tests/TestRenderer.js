import Canvas from 'canvas'
import { Neuron } from '../src/neat/Neuron.js'

/** @typedef {import('../src/neat/Brain').Brain} Brain */
/** @typedef {import('../src/neat/Synapse').Synapse} Synapse */

const { createCanvas } = Canvas

export class TestRenderer {
  /**
   * @param {number} width
   * @param {number} height
   */
  constructor (width, height) {
    this.width = width
    this.height = height

    this.canvas = createCanvas(width, height)
    this.context = this.canvas.getContext('2d')
  }

  /**
   * @param {Brain} brain
   */
  render (brain) {
    try {
      this.cache = {}
      this.context.fillStyle = '#ffffff'
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

      const offset = 10
      const width = this.width - offset * 2
      const height = this.height - offset * 2
      const spacing = height / Math.max(brain.inputSize, brain.outputSize)

      for (let i = 0; i < brain.inputSize; i++) {
        const input = brain.neurons[i]
        this.drawNode(
          offset,
          offset + spacing * i - (spacing * brain.inputSize - height) / 2,
          input
        )
      }

      for (let i = 0; i < brain.outputSize; i++) {
        const output = brain.neurons[i + brain.inputSize]
        this.drawNode(
          offset + width - 12,
          offset + spacing * i - (spacing * brain.outputSize - height) / 2,
          output
        )
      }

      const hiddenCount = brain.neurons.length - brain.inputSize - brain.outputSize
      for (let i = 0; i < hiddenCount; i++) {
        const hidden = brain.neurons[i + brain.inputSize + brain.outputSize]
        this.drawNode(
          offset + this.random(hidden.id) * width * 0.8 + width * 0.1,
          offset + this.random(hidden.id) * height * 0.5 + height * 0.25,
          hidden
        )
      }

      for (const synapse of brain.synapses) {
        this.drawConnection(synapse)
      }
    } catch (error) {
      console.log(brain)
      throw error
    }
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {Neuron} neuron
   */
  drawNode (x, y, neuron) {
    x = Math.floor(x)
    y = Math.floor(y)

    this.cache[neuron.id] = { x, y }

    this.context.font = '9px sans-serif'
    this.context.textAlign = 'center'
    this.context.fillStyle = 'gray'
    this.context.strokeStyle = 'gray'

    this.context.fillText(String(neuron.id + 1), x + 6, y + 10)
    this.context.strokeRect(x + 0.5, y + 0.5, 12, 12)

    const layer = neuron.layer
    if (layer !== Neuron.HIDDEN) {
      this.context.beginPath()
      this.context.moveTo(x + (layer === Neuron.INPUT ? -7 : 14) + 0, y + 3.5 + 0)
      this.context.lineTo(x + (layer === Neuron.INPUT ? -7 : 14) + 6, y + 3.5 + 3)
      this.context.lineTo(x + (layer === Neuron.INPUT ? -7 : 14) + 0, y + 3.5 + 6)
      this.context.closePath()
      this.context.fill()
    }
  }

  /**
   * @param {Synapse} synapse
   */
  drawConnection (synapse) {
    try {
      const input = this.cache[synapse.input]
      const output = this.cache[synapse.output]

      const distanceX = output.x - input.x
      const distanceY = output.y - input.y

      const length = Math.sqrt(Math.abs(distanceY) ** 2 + Math.abs(distanceX ** 2)) - 20
      const angle = Math.atan2(distanceY, distanceX)

      this.context.beginPath()

      this.context.moveTo(
        input.x + 6 + Math.cos(angle) * 10,
        input.y + 6 + Math.sin(angle) * 10
      )

      this.context.lineTo(
        input.x + 6 + Math.cos(angle) * (length + 10),
        input.y + 6 + Math.sin(angle) * (length + 10)
      )

      this.context.arc(
        input.x + 6 + Math.cos(angle) * (length + 10),
        input.y + 6 + Math.sin(angle) * (length + 10),
        1.5, 0, Math.PI * 2
      )

      this.context.lineWidth = Math.abs(synapse.weight * 0.9) + 0.1
      this.context.strokeStyle = synapse.expressed ? (synapse.weight > 0 ? 'blue' : 'red') : (synapse.weight > 0 ? 'rgb(200, 200, 220)' : 'rgb(220, 200, 200)')
      this.context.stroke()
      this.context.closePath()

      this.context.font = '9px sans-serif'
      this.context.textAlign = 'center'
      this.context.fillStyle = 'gray'

      this.context.fillText(`${synapse.innovation}: ${synapse.weight.toFixed(2)}`, distanceX / 3 + input.x, distanceY / 3 + input.y)
    } catch (error) {
      console.log(synapse)
      throw error
    }
  }

  random (seed) {
    const x = Math.sin(seed) * Math.PI
    return x - Math.floor(x)
  }
}
