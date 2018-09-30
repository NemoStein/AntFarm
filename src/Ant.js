import Box from './Box.js';
import Network from './Network.js';

export default class Ant
{
	/**
	 * @param {Box} box 
	 * @param {*} species 
	 * @param {Ant} [parentA] 
	 * @param {Ant} [parentB] 
	 */
	constructor(box, species, parentA, parentB)
	{
		// this.id = Math.ceil(Math.random() * 1000) + ((parentA && parentB) ? `(${parentA.id}:${parentB.id})` : '')
		
		this.box = box;
		this.species = species;
		
		this.dead = false;
		// this.lifeExpectancy = (parentA && parentB) ? (parentA.life + parentB.life) / 2 : 25;
		// this.health = this.lifeExpectancy * 0.9 + Math.random() * this.lifeExpectancy * 0.2;
		// this.life = this.health;
		this.health = 1000;
		this.fitness = 0;
		this.hunger = 0;
		
		this.network = (parentA && parentB) ? Network.mix(parentA.network, parentB.network) : new Network(3, 15, 2);
		
		this.x = Math.random() * box.width;
		this.y = Math.random() * box.height;
		this.rotation = Math.random() * Math.PI * 2;
		this.speed = 15;
		
		this.antennae =
		{
			left:
			{
				lenght: 6,
				x: 0,
				y: 0,
			},
			
			right:
			{
				lenght: 6,
				x: 0,
				y: 0,
			},
			
			back:
			{
				lenght: 3,
				x: 0,
				y: 0,
			},
		}
	}
	
	/**
	 * @param {Number} elapsed 
	 */
	update(elapsed)
	{
		this.hunger += elapsed;
		this.health -= this.hunger;
		this.fitness += elapsed;
		
		if (this.health <= 0)
		{
			this.box.kill(this);
			return;
		}
		
		const left = this.rotation - Math.PI / 4;
		this.antennae.left.x = this.x + Math.cos(left) * this.antennae.left.lenght;
		this.antennae.left.y = this.y + Math.sin(left) * this.antennae.left.lenght;
		
		const right = this.rotation + Math.PI / 4;
		this.antennae.right.x = this.x + Math.cos(right) * this.antennae.right.lenght;
		this.antennae.right.y = this.y + Math.sin(right) * this.antennae.right.lenght;
		
		const back = this.rotation + Math.PI;
		this.antennae.back.x = this.x + Math.cos(back) * this.antennae.back.lenght;
		this.antennae.back.y = this.y + Math.sin(back) * this.antennae.back.lenght;
		
		this.network.input[0] = this.box.getScentFrom(this.antennae.left.x, this.antennae.left.y);
		this.network.input[1] = this.box.getScentFrom(this.antennae.right.x, this.antennae.right.y);
		this.network.input[2] = this.box.getScentFrom(this.antennae.back.x, this.antennae.back.y);
		this.network.process();
		
		this.rotation += (this.network.output[0] - this.network.output[1]) * Math.PI;
		
		if (this.rotation < 0)
		{
			this.rotation += Math.PI * 2;
		}
		else if (this.rotation > Math.PI * 2)
		{
			this.rotation -= Math.PI * 2;
		}
		
		this.x += Math.cos(this.rotation) * this.speed * elapsed;
		this.y += Math.sin(this.rotation) * this.speed * elapsed;
		
		const food = this.box.getFoodNear(this.x, this.y);
		if (food)
		{
			this.hunger = 0;
			this.health += 25;
			this.box.consumeFood(food);
		}
	}
};