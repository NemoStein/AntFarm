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

	/**
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	getFoodScentFrom(x, y)
	{
		let scent = 0
		for (const item of this.food)
		{
			const squareDistance = Math.abs(item.x - x) ** 2 + Math.abs(item.y - y) ** 2
			scent += item.scent / squareDistance
		}

		return scent
	}

	/**
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	getPheromoneScentFrom(x, y)
	{
		let scent = 0
		for (const item of this.pheromone)
		{
			const squareDistance = Math.abs(item.x - x) ** 2 + Math.abs(item.y - y) ** 2
			scent += item.scent / squareDistance
		}

		return scent
	}

	/**
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	getAnthillDirectionFrom(x, y)
	{
		return Math.atan2(this.anthill.y - y, this.anthill.x - x)
	}

	/**
	 * @param {Number} x 
	 * @param {Number} y 
	 * @param {number} scent 
	 */
	dropFoodAt(x, y, scent)
	{
		this.food.push(new Food(x, y, scent))
	}

	/**
	 * @param {Number} x 
	 * @param {Number} y 
	 * @param {number} scent 
	 */
	dropPheromoneAt(x, y, scent)
	{
		this.pheromone.push(new Pheromone(x, y, scent))
	}

	/**
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	pickFoodAt(x, y)
	{
		for (const food of this.food)
		{
			if (food.x === x && food.y === y)
			{
				food.dropped = false
				return food
			}
		}
	}
}
