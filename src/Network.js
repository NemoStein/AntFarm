export default class Network
{
	constructor(inputSize, maxHiddenSize, outputSize)
	{
		this.input = new Array(inputSize);
		this.hidden = new Array(Math.ceil(Math.random() * (maxHiddenSize - outputSize) + outputSize));
		this.output = new Array(outputSize);
		
		this.synapses =
		[
			new Array(inputSize * this.hidden.length),
			new Array(outputSize * this.hidden.length),
		];
		
		for (let i = 0; i < this.synapses.length; i++)
		{
			for (let j = 0; j < this.synapses[i].length; j++)
			{
				this.synapses[i][j] = Math.random();
			}
		}
	}
	
	process()
	{
		this.hidden.fill(0);
		this.output.fill(0);
		
		for (let i = 0; i < this.input.length; i++)
		{
			for (let j = 0; j < this.hidden.length; j++)
			{
				this.hidden[j] += this.input[i] * this.synapses[0][i * this.hidden.length + j];
			}
		}
		
		for (let i = 0; i < this.hidden.length; i++)
		{
			for (let j = 0; j < this.output.length; j++)
			{
				this.output[j] += this.hidden[i] * this.synapses[1][i * this.output.length + j];
			}
		}
	}
	
	/**
	 * @param {Network} networkA 
	 * @param {Network} networkB 
	 * @returns {Network}
	 */
	static mix(networkA, networkB)
	{
		const inputSize = networkA.input.length;
		const outputSize = networkA.output.length;
		const hiddenSizeA = networkA.hidden.length;
		const hiddenSizeB = networkB.hidden.length;
		const hiddenSize = Math.round(Math.random() * Math.abs(hiddenSizeA - hiddenSizeB) + Math.min(hiddenSizeA, hiddenSizeB));
		
		const network = new Network(inputSize, 0, outputSize);
		network.hidden = new Array(hiddenSize);
		network.synapses =
		[
			new Array(inputSize * hiddenSize),
			new Array(outputSize * hiddenSize),
		];
		
		for (let i = 0; i < network.synapses.length; i++)
		{
			for (let j = 0; j < network.synapses[i].length; j++)
			{
				const inherithed = Math.random() < 0.5 ? networkA.synapses[i][j] : networkB.synapses[i][j];
				let synapse = inherithed || Math.random();
				
				if (Math.random() < 0.15)
				{
					synapse = Math.min(Math.max((Math.random() * 2 - 1) + synapse, 0), 1)
				}
				
				network.synapses[i][j] = synapse;
			}
		}
		
		return network;
	}
}