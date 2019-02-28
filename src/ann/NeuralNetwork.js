export default class NeuralNetwork
{
	constructor(inputNodeCount, outputNodeCount)
	{

	}

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
		return [0, inputs[4] / Math.PI]
	}
}
