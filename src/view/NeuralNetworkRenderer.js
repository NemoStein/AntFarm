import NeuralNetwork from '../ann/NeuralNetwork.js'

export default class NeuralNetworkRenderer
{
	/**
	 * @param {CanvasRenderingContext2D} context 
	 * @param {NeuralNetwork} neuralNetwork 
	 */
	constructor(context, neuralNetwork)
	{
		this.context = context
		this.network = neuralNetwork
	}

	update()
	{
		
	}
}
