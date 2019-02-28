import Ant from './Ant.js'
import Formicary from './Formicary.js'

export default class Population
{
	/**
	 * @param {Number} size 
	 * @param {Formicary} formicary 
	 */
	constructor(size, formicary)
	{
		/** @type {Ant[]} */
		this.ants = []
		
		while(size-- > 0)
		{
			this.ants.push(new Ant(formicary))
		}
	}
}