import NeuralNetwork from './NeuralNetwork'
import Formicary from './Formicary'

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
		this.direction = 0
		this.speed = 10
		this.cargo = null
		this.dead = false

		this.antennae = {
			left: { x: 0, y: 0, },
			right: { x: 0, y: 0, },
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
	}

	update()
	{
		const antennaeLength = 6

		const left = this.direction - Math.PI / 6
		this.antennae.left.x = this.x + Math.cos(left) * antennaeLength
		this.antennae.left.y = this.y + Math.sin(left) * antennaeLength

		const right = this.direction + Math.PI / 6
		this.antennae.right.x = this.x + Math.cos(right) * antennaeLength
		this.antennae.right.y = this.y + Math.sin(right) * antennaeLength
		
		const leftFoodScent = this.formicary.getFoodScentFrom(this.antennae.left.x, this.antennae.left.y)
		const rightFoodScent = this.formicary.getFoodScentFrom(this.antennae.right.x, this.antennae.right.y)
		const leftPheromoneScent = this.formicary.getPheromoneScentFrom(this.antennae.left.x, this.antennae.left.y)
		const rightPheromoneScent = this.formicary.getPheromoneScentFrom(this.antennae.right.x, this.antennae.right.y)
		const anthillDirection = this.formicary.getAnthillDirectionFrom(this.x, this.y)
		const carrying = this.cargo ? 1 : 0
		
		const [hold, direction] = this.brain.update(leftFoodScent, rightFoodScent, leftPheromoneScent, rightPheromoneScent, anthillDirection, carrying)
	}
}
