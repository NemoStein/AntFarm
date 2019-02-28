export default class NeuralNetwork
{
	/**
	 * @param {number} inputNodeCount
	 * @param {number} outputNodeCount
	 */
	constructor(inputNodeCount, outputNodeCount)
	{
		this.inputNodeCount = inputNodeCount
		this.outputNodeCount = outputNodeCount
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

		for (let i = 0; i < this.outputNodeCount; i++)
		{
			output.push(Math.random() * 2 - 1)
		}

		return output
	}
}
