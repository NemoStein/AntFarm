import Box from './Box.js';

export default class Simulation
{
	constructor(side, population, species, food)
	{
		this.time = 0;
		this.box = new Box(side, side, food);

		this.box.populate(population, species);
	}

	start(callback)
	{
		this.callback = callback;
		this.loop(performance.now());
	}

	loop(time)
	{
		const elapsed = (time - this.time) / 1000;
		this.time = time;

		let colonyDied;

		for (let i = 0; i < window.speed; i++)
		{
			colonyDied = this.box.update(elapsed);
			if (colonyDied)
			{
				this.box.nextGeneration();
				break;
			}
		}

		requestAnimationFrame(this.loop.bind(this));
		this.callback(colonyDied);
	};
}
