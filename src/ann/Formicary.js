import Food from './Food'
import Pheromone from './Pheromone'

export default class Formicary
{
	/**
	 * @param {Number} width Width of the formicary
	 * @param {Number} height Height of the formicary
	 * @param {Number} anthillX X position of the anthill
	 * @param {Number} anthillY Y position of the anthill
	 */
	constructor(width, height, anthillX, anthillY)
	{
		this.width = width
		this.height = height

		this.anthill = {
			x: anthillX,
			y: anthillY
		}

		/** @type {Food[]} */
		this.food = []

		/** @type {Pheromone[]} */
		this.pheromone = []
	}

	getFoodScentFrom(x, y)
	{
		return this.getScentFrom(x, y, this.food)
	}

	getPheromoneScentFrom(x, y)
	{
		return this.getScentFrom(x, y, this.pheromone)
	}

	getScentFrom(x, y, scents)
	{
		let scent = 0
		for (const item of scents)
		{
			const squareDistance = Math.abs(item.x - x) ** 2 + Math.abs(item.y - y) ** 2
			scent += item.scent / squareDistance
		}

		return scent
	}

	getAnthillDirectionFrom(x, y)
	{
		return Math.atan2(this.anthill.y - y, this.anthill.x - x)
	}

	addFoodAt(x, y)
	{
		this.food.push(new Food(x, y))
	}

	addPheromoneAt(x, y)
	{
		this.pheromone.push(new Pheromone(x, y))
	}
}
