import Ant from './Ant.js';
import Food from './Food.js';

export default class Box
{
	/**
	 * @param {Number} width 
	 * @param {Number} height 
	 * @param {Number} foodCount 
	 */
	constructor(width, height, foodCount)
	{
		this.currentGen = 0;
		this.width = width;
		this.height = height;
		this.foodCount = foodCount;

		/** @type {Ant[]} */
		this.ants = null;
		/** @type {Food[]} */
		this.food = null;

		this.addFood(foodCount);
	}

	addFood(count)
	{
		this.food = [];
		while (count-- > 0)
		{
			const x = Math.round(Math.random() * this.width);
			const y = Math.round(Math.random() * this.height);

			this.food.push(new Food(this, x, y));
		}
	}

	/**
	 * @param {Number} size 
	 * @param {Number} species 
	 */
	populate(size, species)
	{
		this.ants = [];
		while (size-- > 0)
		{
			for (let i = 0; i < species; i++)
			{
				this.ants.push(new Ant(this, i));
			}
		}
	}

	nextGeneration()
	{
		console.log('Current Gen: ' + ++this.currentGen);

		const species = [];
		const fittest = [];

		for (const ant of this.ants)
		{
			if (!species[ant.species])
			{
				species[ant.species] = [ant];
			}
			else
			{
				species[ant.species].push(ant);
			}
		}

		this.ants = [];
		for (const ants of species)
		{
			ants.sort((a, b) =>
			{
				return b.fitness - a.fitness;
			});

			console.log(`Species ${ants[0].species} fitness: ${ants.map(ant => Math.round(ant.fitness))} | ${Math.round(ants.reduce((value, ant) => value + ant.fitness, 0))}`)

			const type = fittest.length;
			fittest.push(ants.slice(0, 2));
			// fittest.push(ants.slice(0, Math.max(Math.ceil(ants.length / 3), 2)));

			for (let i = 0; i < ants.length; i++)
			{
				const parentA = fittest[type][(Math.random() * fittest[type].length) | 0];
				let parentB;

				do {
					parentB = fittest[type][(Math.random() * fittest[type].length) | 0];
				}
				while (parentA === parentB);

				this.ants.push(new Ant(this, type, parentA, parentB));
			}
		}

		this.addFood(this.foodCount);
	}

	/**
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	getScentFrom(x, y)
	{
		let scent = 0;
		for (const food of this.food)
		{
			if (food.consumed)
			{
				continue;
			}

			const distanceX = food.x - x;
			const distanceY = food.y - y;
			const distanceSquared = distanceX * distanceX + distanceY * distanceY;

			scent += food.scent / distanceSquared;
		}

		return scent;
	}

	/**
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	getFoodNear(x, y)
	{
		const threshold = 2;
		let nearest = null;
		let distance = Infinity;

		for (const food of this.food)
		{
			if (food.consumed)
			{
				continue;
			}

			const distanceX = food.x - x;
			const distanceY = food.y - y;

			if (Math.abs(distanceX) > threshold || Math.abs(distanceY) > threshold)
			{
				continue;
			}

			const distanceSquared = distanceX * distanceX + distanceY * distanceY;

			if (distanceSquared < threshold * threshold && distanceSquared < distance)
			{
				distance = distanceSquared;
				nearest = food;
			}
		}

		return nearest;
	}

	/**
	 * @param {Food} food 
	 */
	consumeFood(food)
	{
		food.consumed = true;
		// this.food.splice(this.food.indexOf(food), 1);
	}

	/**
	 * 
	 * @param {Ant} ant 
	 */
	kill(ant)
	{
		ant.dead = true;
		// this.ants.splice(this.ants.indexOf(ant), 1);
	}

	update(elapsed)
	{
		let colonyDied = true;
		for (const ant of this.ants)
		{
			if (ant.dead)
			{
				continue;
			}

			colonyDied = false;
			ant.update(elapsed);
		}

		return colonyDied;
	}
}
