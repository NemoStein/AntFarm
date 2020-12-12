/* global Path2D */

import { CanvasRenderer } from './CanvasRenderer.js'

/** @typedef {import('../neat/Brain.js').Brain} Brain */
/** @typedef {import('../neat/Synapse.js').Synapse} Synapse */
/** @typedef {import('../utils/Cursor.js').Cursor} Cursor */

export class NeuralNetworkRenderer extends CanvasRenderer {
  /**
   * @param {number} width
   * @param {number} height
   */
  constructor (x, y, width = 400, height = 100) {
    super(x, y, width, height)

    this.seedOffset = Math.random() * 1000
    this.buttonHeigth = 20
    this.serializeButton = {
      x: 0,
      y: height - this.buttonHeigth,
      width: 120,
      height: this.buttonHeigth
    }
  }

  /**
   * @param {Brain} brain
   */
  render (brain) {
    this.cache = {}
    this.clear()

    const graphHeigth = this.height - this.buttonHeigth
    const vSpacing = graphHeigth / Math.max(brain.inputSize, brain.outputSize)

    for (let i = 0; i < brain.inputSize; i++) {
      const input = brain.neurons[i]
      this.drawNode(0, vSpacing * i - (vSpacing * brain.inputSize - graphHeigth) / 2, input.id)
    }

    for (let i = 0; i < brain.outputSize; i++) {
      const output = brain.neurons[i + brain.inputSize]
      this.drawNode(this.width - 15, vSpacing * i - (vSpacing * brain.outputSize - graphHeigth) / 2, output.id)
    }

    const hiddenCount = brain.neurons.length - brain.inputSize - brain.outputSize
    for (let i = 0; i < hiddenCount; i++) {
      const hidden = brain.neurons[i + brain.inputSize + brain.outputSize]
      this.drawNode(this.random(hidden.id, this.width * 0.8) + this.width * 0.1, this.random(hidden.id + brain.neurons.length, 70) + 15, hidden.id)
    }

    for (const synapse of brain.synapses) {
      if (synapse.expressed) {
        this.drawConnection(synapse)
      }
    }

    this.drawButtons()
  }

  drawNode (x, y, id) {
    if (!this.cache[id]) {
      this.cache[id] = { x, y }

      this.context.font = '9px sans-serif'
      this.context.textAlign = 'center'
      this.context.fillStyle = 'gray'
      this.context.strokeStyle = 'gray'

      this.context.fillText(String(id), Math.floor(x) + 6, Math.floor(y) + 10)
      this.context.strokeRect(Math.floor(x) + 0.5, Math.floor(y) + 0.5, 12, 12)
    }
  }

  /**
   * @param {Synapse} synapse
   */
  drawConnection (synapse) {
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
    this.context.strokeStyle = synapse.weight > 0 ? 'blue' : 'red'
    this.context.stroke()
    this.context.closePath()
  }

  drawButtons () {
    this.context.fillStyle = '#eeeeee'
    this.context.strokeStyle = 'gray'

    const { x, y, width, height } = this.serializeButton

    this.context.fillRect(x, y, width, height)
    this.context.strokeRect(x, y, width, height)

    this.context.font = '9px sans-serif'
    this.context.textAlign = 'center'
    this.context.fillStyle = 'gray'
    this.context.fillText('serialize', width / 2 + x, height / 2 + 3 + y)
  }

  random (seed, scale) {
    const x = Math.sin(seed + this.seedOffset) * 10000
    return (x - Math.floor(x)) * scale
  }

  /**
   * @param {Cursor} cursor
   */
  update (cursor) {
    const { x, y, width, height } = this.serializeButton
    const path = new Path2D()
    path.rect(x, y, width, height)

    if (this.context.isPointInPath(path, cursor.x - this.x, cursor.y - this.y)) {
      document.body.style.cursor = 'pointer'

      if (
        cursor.pressed &&
        cursor.released &&
        this.context.isPointInPath(path, cursor.pressed.x - this.x, cursor.pressed.y - this.y) &&
        this.context.isPointInPath(path, cursor.released.x - this.x, cursor.released.y - this.y)
      ) {
        console.log('Click')
      }
    } else {
      document.body.style.cursor = 'auto'
    }
  }
}
