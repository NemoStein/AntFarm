import Box from './Box.js';

export default class Food
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
		this.scent = 2.5;
		this.consumed = false;
	}
}