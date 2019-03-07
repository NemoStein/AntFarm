let currentInnovation = 0

export default class NeuralNetwork
{
	/**
	 * @param {number} inputSize
	 * @param {number} outputSize
	 */
	constructor(inputSize, outputSize)
	{
		this.inputSize = inputSize
		this.outputSize = outputSize

		/** @type {Neuron[]} */
		this.neurons = []

		/** @type {Synapse[]} */
		this.synapses = []

		for (let i = 0; i < inputSize; i++)
		{
			this.neurons.push(new Neuron(this.neurons.length, Neuron.INPUT))
		}

		for (let i = 0; i < outputSize; i++)
		{
			this.neurons.push(new Neuron(this.neurons.length, Neuron.OUTPUT))
		}
	}

	/**
	 * @param {Number} x 
	 */
	sigmoid(x)
	{
		return 1 / (1 + Math.E ** -x)
	}

	/**
	 * @param  {...Number} inputs 
	 * @returns {Number[]}
	 */
	update(...inputs)
	{
		const output = []

		for (let i = 0; i < this.outputSize; i++)
		{
			output.push(Math.random() * 2 - 1)
		}

		return output
	}

	addRandomNeuron()
	{
		// Getting (and disabling) a random, expressed, connection
		let synapse

		do {
			synapse = this.synapses[Math.floor(Math.random() * this.synapses.length)]
		}
		while (!synapse.expressed)

		synapse.expressed = false

		// Creating a new Node and 2 new connections to replace the old connection
		// const neuron = new Neuron(Neuron.HIDDEN)
		const neuron = new Neuron(this.neurons.length, Neuron.HIDDEN)
		this.neurons.push(neuron)
		this.synapses.push(new Synapse(synapse.input, neuron, 1, currentInnovation))
		this.synapses.push(new Synapse(neuron, synapse.output, synapse.weight, currentInnovation))

		currentInnovation++
	}

	addRandomSynapse()
	{
		let reroll
		let input
		let output

		// This will get stuck in a infinite loop in case of all input, hidden and output is already connected
		do {
			input = this.neurons[Math.floor(Math.random() * (this.neurons.length - this.outputSize))]
			output = this.neurons[Math.floor(Math.random() * (this.neurons.length - this.inputSize) + this.inputSize)]

			reroll = false

			if (output.layer <= input.layer)
			{
				reroll = true
				continue
			}

			for (const synapse of this.synapses)
			{
				if (synapse.input === input && synapse.output === output)
				{
					reroll = true
					continue
				}
			}
		}
		while (reroll)


		const weight = Math.random() * 2 - 1
		this.synapses.push(new Synapse(input, output, weight, currentInnovation++))
	}

	static crossover(parent1, parent2)
	{

	}
}

class Neuron
{
	static INPUT = 0
	static HIDDEN = 1
	static OUTPUT = 2

	/**
	 * @param {Number} id
	 * @param {Number} layer
	 */
	constructor(id, layer)
	{
		this.id = id
		this.layer = layer
	}
}

class Synapse
{
	/**
	 * @param {Neuron} input 
	 * @param {Neuron} output 
	 * @param {Number} weight 
	 * @param {Number} innovation 
	 */
	constructor(input, output, weight, innovation)
	{
		this.input = input
		this.output = output
		this.weight = weight
		this.expressed = true
		this.innovation = innovation
	}

	clone()
	{
		return new Synapse(this.input, this.output, this.weight, this.innovation)
	}
}
