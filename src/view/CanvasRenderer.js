import Formicary from '../ann/Formicary.js'
import Ant from '../ann/Ant.js';

export default class CanvarRenderer
{
	/**
	 * @param {HTMLCanvasElement} canvas 
	 * @param {Formicary} formicary 
	 */
	constructor(canvas, formicary)
	{
		this.canvas = canvas
		this.context = canvas.getContext('2d')

		this.formicary = formicary
	}

	update()
	{
		const width = this.canvas.width
		const height = this.canvas.height

		this.context.clearRect(0, 0, width, height)

		if (this.formicary)
		{
			const offsetX = (width - this.formicary.width) / 2
			const offsetY = (height - this.formicary.height) / 2

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

			this.context.fillStyle = 'blue'
			for (const { x, y } of this.formicary.food)
			{
				this.context.fillRect(x + offsetX - 1, y + offsetY - 1, 2, 2)
			}

			let colorIndex = 0
			for (const population of this.formicary.populations)
			{
				this.context.fillStyle = ['#c33', '#cc3', '#3c3', '#3cc', '#33c', '#c3c'][colorIndex++]
				for (const ant of population.ants)
				{
					this.context.fillRect(ant.antennae.left.x + offsetX - 1, ant.antennae.left.y + offsetY - 1, 2, 2)
					this.context.fillRect(ant.antennae.right.x + offsetX - 1, ant.antennae.right.y + offsetY - 1, 2, 2)
					this.context.fillRect(ant.x + offsetX - 2, ant.y + offsetY - 2, 4, 4)
				}
			}
		}
	}
}
