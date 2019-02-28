import Food from './Food.js'
import Pheromone from './Pheromone.js'
import Population from './Population.js'

export default class Formicary
{
	/**
	 * @param {Number} width Width of the formicary
	 * @param {Number} height Height of the formicary
	 * @param {Number} anthillX X position of the anthill
	 * @param {Number} anthillY Y position of the anthill
	 * @param {Number} anthillRadius Radius of the anthill
	 * @param {Number} populationSize Size of the population
	 */
	constructor(width, height, anthillX, anthillY, anthillRadius, populationSize)
	{
		this.width = width
		this.height = height

		this.anthill = {
			x: anthillX,
			y: anthillY,
			radius: anthillRadius,
		}

		/** @type {Food[]} */
		this.food = []

		/** @type {Pheromone[]} */
		this.pheromone = []

		/** @type {Population} */
		this.population = new Population(populationSize, this)
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
	 * @returns {Number} Scent
	 */
	pickFoodAt(x, y)
	{
		for (let i = 0; i < this.food.length; i++)
		{
			const food = this.food[i];
			if (food.x === x && food.y === y)
			{
				this.food.splice(i, 1)
				return food.scent
			}
		}

		return 0
	}

	update()
	{
		this.population.update()
	}
}
