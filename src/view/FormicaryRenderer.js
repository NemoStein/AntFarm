import Formicary from '../ann/Formicary.js'

export default class FormicaryRenderer
{
	/**
	 * @param {CanvasRenderingContext2D} context 
	 * @param {Formicary} formicary 
	 */
	constructor(context, formicary)
	{
		this.context = context
		this.formicary = formicary
	}

	update()
	{
		if (this.formicary)
		{
			const offsetX = Math.round((this.context.canvas.width - this.formicary.width) / 2)
			const offsetY = 120

			this.context.strokeStyle = 'black'
			this.context.strokeRect(offsetX, offsetY, this.formicary.width, this.formicary.height)

			const anthillPath = new Path2D()
			anthillPath.arc(this.formicary.anthill.x + offsetX, this.formicary.anthill.y + offsetY, this.formicary.anthill.radius, 0, Math.PI * 2)
			this.context.strokeStyle = 'blue'
			this.context.stroke(anthillPath)

			this.context.fillStyle = 'rgba(255, 0, 255, .2)'
			for (const { x, y } of this.formicary.pheromone)
			{
				this.context.fillRect(x + offsetX - 1, y + offsetY - 1, 2, 2)
			}

			this.context.fillStyle = 'brown'
			for (const { x, y } of this.formicary.food)
			{
				this.context.fillRect(x + offsetX - 1, y + offsetY - 1, 2, 2)
			}

			for (const ant of this.formicary.population.ants)
			{
				//'#c33', '#cc3', '#3c3', '#3cc', '#33c', '#c3c'
				this.context.fillStyle = ant.dead ? 'silver' : 'dimgray'
				this.context.fillRect(ant.x + offsetX - 2, ant.y + offsetY - 2, 4, 4)
				this.context.fillRect(ant.antennae.left.x + offsetX - 1, ant.antennae.left.y + offsetY - 1, 2, 2)
				this.context.fillRect(ant.antennae.right.x + offsetX - 1, ant.antennae.right.y + offsetY - 1, 2, 2)
			}
		}
	}
}
