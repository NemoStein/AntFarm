import NeuralNetwork from './NeuralNetwork.js'
import Formicary from './Formicary.js'

export default class Ant
{
	/**
	 * @param {Formicary} formicary 
	 */
	constructor(formicary)
	{
		this.formicary = formicary

		this.x = 0
		this.y = 0
		this.direction = Math.random() * Math.PI * 2
		this.speed = 0.15
		this.cargo = null
		this.dead = false

		this.travel = 0
		this.travelThreshold = 1 ** 2

		this.antennae = {
			left: { x: 0, y: 0 },
			right: { x: 0, y: 0 },
		}

		/**
		 * Brain input (6)
		 * - Left food scent
		 * - Right food scent
		 * - Left pheromone scent
		 * - Right pheromone scent
		 * - Anthill direction
		 * - Carrying
		 * 
		 * Brain output (2)
		 * - Hold
		 * - Direction
		 */
		this.brain = new NeuralNetwork(6, 2)

		this.updateAntenna()
	}

	update()
	{
		this.updateAntenna()

		const leftFoodScent = this.formicary.getFoodScentFrom(this.antennae.left.x, this.antennae.left.y)
		const rightFoodScent = this.formicary.getFoodScentFrom(this.antennae.right.x, this.antennae.right.y)
		const leftPheromoneScent = this.formicary.getPheromoneScentFrom(this.antennae.left.x, this.antennae.left.y)
		const rightPheromoneScent = this.formicary.getPheromoneScentFrom(this.antennae.right.x, this.antennae.right.y)
		const anthillDirection = this.formicary.getAnthillDirectionFrom(this.x, this.y)
		const carrying = this.cargo ? 1 : 0

		const [hold, direction] = this.brain.update(leftFoodScent, rightFoodScent, leftPheromoneScent, rightPheromoneScent, anthillDirection, carrying)

		if (this.cargo && !hold)
		{
			this.formicary.dropFoodAt(this.x, this.y, this.cargo)
		}
		else if (!this.cargo && hold)
		{
			const food = this.formicary.pickFoodAt(this.x, this.y)
			if (food)
			{
				this.cargo = food
			}
		}

		// This is VERY likely to cause problems!!!
		this.direction += direction

		const travelX = Math.cos(this.direction) * this.speed
		const travelY = Math.sin(this.direction) * this.speed
		this.travel += travelX ** 2 + travelY ** 2

		this.x += travelX
		this.y += travelY

		if (this.x <= 0 || this.x >= this.formicary.width || this.y <= 0 || this.y >= this.formicary.height)
		{
			this.die()
		}

		if (this.travel > this.travelThreshold)
		{
			this.travel -= this.travelThreshold
			this.formicary.dropPheromoneAt(this.x, this.y, 1)
		}
	}

	updateAntenna()
	{
		const antennaeLength = 6

		const left = this.direction - Math.PI / 6
		this.antennae.left.x = this.x + Math.cos(left) * antennaeLength
		this.antennae.left.y = this.y + Math.sin(left) * antennaeLength

		const right = this.direction + Math.PI / 6
		this.antennae.right.x = this.x + Math.cos(right) * antennaeLength
		this.antennae.right.y = this.y + Math.sin(right) * antennaeLength
	}
	
	die()
	{
		this.dead = true
	}
}
