let currentInnovation = 0

export default class NeuralNetwork
{
	/**
	 * @param {number} inputNodeCount
	 * @param {number} outputNodeCount
	 */
	constructor(inputNodeCount, outputNodeCount)
	{
		this.inputSize = inputNodeCount
		this.outputSize = outputNodeCount

		/** @type {Neuron[]} */
		this.neurons = []

		/** @type {Synapse[]} */
		this.synapses = []
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
		// Getting (and disabling) a random connection
		const synapse = this.synapses[Math.floor(Math.random() * this.synapses.length)]
		synapse.expressed = false

		// Creating a new Node and 2 new connections to replace the old connection
		// const neuron = new Neuron(Neuron.HIDDEN)
		const neuron = new Neuron()
		this.neurons.push(neuron)
		this.synapses.push(new Synapse(synapse.input, neuron, 1, currentInnovation))
		this.synapses.push(new Synapse(neuron, synapse.output, synapse.weight, currentInnovation))
		
		currentInnovation++
	}

	addRandomSynapse()
	{
		const input = this.neurons[Math.floor(Math.random() * (this.neurons.length - this.outputSize))]
		const output = this.neurons[Math.floor(Math.random() * (this.neurons.length - this.inputSize) + this.inputSize)]
		const weight = Math.random() * 2 - 1

		this.synapses.push(new Synapse(input, output, weight, currentInnovation++))
	}
	
	static crossover(parent1, parent2)
	{
		
	}
}

class Neuron
{
	// static INPUT = -1
	// static HIDDEN = 0
	// static OUTPUT = 1

	// /**
	//  * @param {Number} layer
	//  */
	// constructor(layer)
	// {
	// 	this.layer = layer
	// }
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
