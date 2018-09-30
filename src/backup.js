class Simulation
{
	constructor(side, population, food)
	{
		this.time = 0;
		this.box = new Box(side, side, food);
		
		this.box.populate(population);
	}
	
	start(callback)
	{
		this.callback = callback;
		simulation.loop(performance.now());
	}
	
	loop(time)
	{
		const elapsed = (time - this.time) / 1000;
		this.time = time;
		
		requestAnimationFrame(this.loop.bind(this));
		
		this.box.update(elapsed);
		this.callback();
	};
}

class Box
{
	/**
	 * @param {Number} width 
	 * @param {Number} height 
	 * @param {Number} foodCount 
	 */
	constructor(width, height, foodCount)
	{
		this.width = width;
		this.height = height;
		/** @type {Food[]} */ this.food = [];
		/** @type {Ant[]} */ this.ants = [];
		
		while (foodCount-- > 0)
		{
			this.addFood();
		}
	}
	
	addFood()
	{
		const x = Math.round(Math.random() * this.width);
		const y = Math.round(Math.random() * this.height);
		
		this.food.push(new Food(this, x, y));
	}
	
	/**
	 * @param {Number} size 
	 */
	populate(size)
	{
		for (let i = 0; i < size; i++)
		{
			this.ants.push(new Ant(this));
		}
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
		for (const ant of this.ants)
		{
			if (ant.dead)
			{
				continue;
			}
			
			ant.update(elapsed);
		}
	}
};

class Food
{
	/**
	 * 
	 * @param {Box} box 
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	constructor(box, x, y)
	{
		this.box = box;
		this.x = x;
		this.y = y;
		this.scent = 1;
		this.consumed = false;
	}
}

class Network
{
	constructor(inputSize, maxHiddenSize, outputSize)
	{
		this.input = new Array(inputSize);
		this.hidden = new Array(Math.ceil(Math.random() * (maxHiddenSize - outputSize) + outputSize));
		this.output = new Array(outputSize);
		
		this.synapses =
		[
			new Array(inputSize * this.hidden.length),
			new Array(outputSize * this.hidden.length),
		];
		
		for (let i = 0; i < this.synapses.length; i++)
		{
			for (let j = 0; j < this.synapses[i].length; j++)
			{
				this.synapses[i][j] = Math.random();
			}
		}
	}
	
	process()
	{
		this.hidden.fill(0);
		this.output.fill(0);
		
		for (let i = 0; i < this.input.length; i++)
		{
			for (let j = 0; j < this.hidden.length; j++)
			{
				this.hidden[j] += this.input[i] * this.synapses[0][i * this.hidden.length + j];
			}
		}
		
		for (let i = 0; i < this.hidden.length; i++)
		{
			for (let j = 0; j < this.output.length; j++)
			{
				this.output[j] += this.hidden[i] * this.synapses[1][i * this.output.length + j];
			}
		}
	}
}

class Ant
{
	/**
	 * @param {Box} box 
	 */
	constructor(box)
	{
		this.box = box;
		this.network = new Network(2, 5, 2);
		
		this.x = Math.random() * box.width;
		this.y = Math.random() * box.height;
		this.rotation = Math.random() * Math.PI * 2;
		this.speed = 15;
		
		this.antennae =
		{
			left:
			{
				lenght: 4,
				x: 0,
				y: 0,
			},
			
			right:
			{
				lenght: 4,
				x: 0,
				y: 0,
			}
		}
		
		this.dead = false;
		this.health = 10;
		this.fitness = 0;
	}
	
	/**
	 * @param {Number} elapsed 
	 */
	update(elapsed)
	{
		this.health -= elapsed;
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
		
		this.network.input[0] = this.box.getScentFrom(this.antennae.left.x, this.antennae.left.y);
		this.network.input[1] = this.box.getScentFrom(this.antennae.right.x, this.antennae.right.y);
		this.network.process();
		
		// this.speed = this.network.output[3];
		this.rotation += (this.network.output[0] - this.network.output[1]) * Math.PI;// * elapsed;
		// this.rotation += (this.network.output[0] > this.network.output[1] ? this.network.output[0] : this.network.output[1]) * Math.PI;// * elapsed;
		
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
			this.health += 1;
			this.box.consumeFood(food);
		}
	}
};