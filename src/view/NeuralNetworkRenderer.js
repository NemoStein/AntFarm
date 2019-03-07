import CanvasRenderer from './CanvasRenderer.js'
import NeuralNetwork from '../ann/NeuralNetwork.js'

export default class NeuralNetworkRenderer extends CanvasRenderer
{
	constructor()
	{
		super(500, 100)
	}

	/**
	 * @param {NeuralNetwork} network 
	 */
	render(network)
	{
		this.cache = {}
		this.clear()

		for (let i = 0; i < network.inputSize; i++)
		{
			const input = network.neurons[i]

			this.drawNode(0, 15 * i - (15 * network.inputSize - 100) / 2, input.id)
		}

		for (let i = 0; i < network.outputSize; i++)
		{
			const output = network.neurons[i + network.inputSize]

			this.drawNode(485, 15 * i - (15 * network.outputSize - 100) / 2, output.id)
		}

		const hiddenCount = network.neurons.length - network.inputSize - network.outputSize
		for (let i = 0; i < hiddenCount; i++)
		{
			const hidden = network.neurons[i + network.inputSize + network.outputSize]

			this.drawNode(this.random(hidden.id, 285) + 100, this.random(hidden.id + network.neurons.length, 70) + 15, hidden.id)
		}

		for (const synapse of network.synapses)
		{
			if (synapse.expressed)
			{
				this.drawConnection(synapse)
			}
		}
	}

	drawNode(x, y, id)
	{
		if (!this.cache[id])
		{
			this.cache[id] = { x, y }

			this.context.font = '9px sans-serif'
			this.context.textAlign = 'center'
			this.context.fillStyle = 'gray'
			this.context.strokeStyle = 'gray'

			this.context.fillText(String(id), Math.floor(x) + 6, Math.floor(y) + 10)
			this.context.strokeRect(Math.floor(x) + 0.5, Math.floor(y) + 0.5, 12, 12)
		}
	}

	drawConnection(synapse)
	{
		const input = this.cache[synapse.input.id]
		const output = this.cache[synapse.output.id]

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

		this.context.lineWidth = synapse.weight * 1 + 0.5
		this.context.strokeStyle = synapse.weight > 0 ? 'blue' : 'red'
		this.context.stroke()
		this.context.closePath()
	}

	seedOffset = Math.random() * 1000
	random(seed, scale)
	{
		const x = Math.sin(seed + this.seedOffset) * 10000
		return (x - Math.floor(x)) * scale
	}
}
