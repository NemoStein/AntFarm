import CanvasRenderer from './view/CanvasRenderer.js'
import Formicary from './ann/Formicary.js';

document.addEventListener('DOMContentLoaded', () =>
{
	const formicary = new Formicary(500, 400, 50, 100, 15)
	
	const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('Canvas'))
	const renderer = new CanvasRenderer(canvas, formicary)

	const fixCanvasSize = () =>
	{
		canvas.width = document.body.clientWidth
		canvas.height = document.body.clientHeight
	}
	
	const gameLoop = time =>
	{
		window.requestAnimationFrame(gameLoop)
		renderer.update()
	}

	window.addEventListener('resize', fixCanvasSize)

	fixCanvasSize()
	gameLoop()
})
