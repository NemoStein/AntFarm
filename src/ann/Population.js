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
		this.formicary = formicary

		/** @type {Ant[]} */
		this.ants = []

		while (size-- > 0)
		{
			const ant = new Ant(formicary)

			ant.x = formicary.anthill.x
			ant.y = formicary.anthill.y
			ant.update()

			this.ants.push(ant)
		}
	}

	update()
	{
		let allDead = true
		for (const ant of this.ants)
		{
			if (!ant.dead)
			{
				allDead = false
				ant.update()
			}
		}

		if (allDead)
		{
			this.formicary.endCurrentGeneration()
		}
	}
}
