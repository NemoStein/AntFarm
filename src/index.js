import CanvasRenderer from './view/CanvasRenderer.js'
import Formicary from './ann/Formicary.js';

document.addEventListener('DOMContentLoaded', () =>
{
	const formicary = buildFormicary()

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

		formicary.update()
		renderer.update()
	}

	window.addEventListener('resize', fixCanvasSize)

	fixCanvasSize()
	gameLoop()
})

const buildFormicary = () =>
{
	const width = 500
	const height = 500
	const anthillX = Math.floor(Math.random() * 400 + 50)
	const anthillY = Math.floor(Math.random() * 400 + 50)
	const anthillRadius = 15
	const populations = 1

	const formicary = new Formicary(width, height, anthillX, anthillY, anthillRadius, populations)

	const food = 100
	for (let i = 0; i < food; i++)
	{
		formicary.dropFoodAt(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500), 5)
	}

	return formicary
}
