import Ant from './src/Ant.js';
import Food from './src/Food.js';
import Simulation from './src/Simulation.js';

window.speed = 1;
const simulation = new Simulation(750, 20, 4, 2500);

const boxElement = document.getElementById('Box');
boxElement.style.width = simulation.box.width + 'px';
boxElement.style.height = simulation.box.height + 'px';

/** @type {Map.<Ant, HTMLElement>} */ const antMap = new Map();
/** @type {Map.<Food, HTMLElement>} */ const foodMap = new Map();

const setup = () =>
{
	boxElement.innerHTML = '';
	
	antMap.clear();
	foodMap.clear();
	
	for (const ant of simulation.box.ants)
	{
		const element = document.createElement('div');
		const antennaLeft = document.createElement('div');
		const antennaRight = document.createElement('div');
		const antennaBack = document.createElement('div');
		
		element.classList.add('ant', 'species' + ant.species);
		antennaLeft.classList.add('antenna', 'left');
		antennaRight.classList.add('antenna', 'right');
		antennaBack.classList.add('antenna', 'back');
		
		element.appendChild(antennaLeft);
		element.appendChild(antennaRight);
		element.appendChild(antennaBack);
		boxElement.appendChild(element);
		
		antMap.set(ant, element);
	}

	for (const food of simulation.box.food)
	{
		const element = document.createElement('div');
		element.classList.add('food');
		element.style.left = food.x + 'px';
		element.style.top = food.y + 'px';
		
		boxElement.appendChild(element);
		foodMap.set(food, element);
	}
};

const update = colonyDied =>
{
	if (colonyDied)
	{
		setup();
		return;
	}
	
	for (const [ant, element] of antMap)
	{
		element.style.left = ant.x + 'px';
		element.style.top = ant.y + 'px';
		
		const antennaLeft = element.querySelector('.antenna.left');
		antennaLeft.style.left = ant.antennae.left.x - ant.x + 'px';
		antennaLeft.style.top = ant.antennae.left.y - ant.y + 'px';
		
		const antennaRight = element.querySelector('.antenna.right');
		antennaRight.style.left = ant.antennae.right.x - ant.x + 'px';
		antennaRight.style.top = ant.antennae.right.y - ant.y + 'px';
		
		const antennaBack = element.querySelector('.antenna.back');
		antennaBack.style.left = ant.antennae.back.x - ant.x + 'px';
		antennaBack.style.top = ant.antennae.back.y - ant.y + 'px';
		
		if (ant.dead)
		{
			antMap.delete(ant);
			element.remove();
		}
	}
	
	for (const [food, element] of foodMap)
	{
		if (food.consumed)
		{
			foodMap.delete(food);
			element.remove();
		}
	}
}

setup();
simulation.start(update);