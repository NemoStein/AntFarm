import { ControlsRenderer } from './view/ControlsRenderer.js'
import { Cursor } from './utils/Cursor.js'
import { Formicary } from './formicary/Formicary.js'
import { FormicaryRenderer } from './view/FormicaryRenderer.js'
import { NeuralNetworkRenderer } from './view/NeuralNetworkRenderer.js'
import { Point } from './utils/Point.js'

document.addEventListener('DOMContentLoaded', () => {
  const formicary = buildFormicary()

  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('Canvas'))
  const context = canvas.getContext('2d')
  const cursor = new Cursor()

  const controlsRenderer = new ControlsRenderer(10, 10, formicary.width, 20)
  const neuralNetworkRenderer = new NeuralNetworkRenderer(10, controlsRenderer.y + controlsRenderer.height + 10, formicary.width, 150)
  const formicaryRenderer = new FormicaryRenderer(10, neuralNetworkRenderer.y + neuralNetworkRenderer.height + 10, formicary.width, formicary.height)

  const fixCanvasSize = () => {
    canvas.width = document.body.clientWidth
    canvas.height = document.body.clientHeight
  }

  const gameLoop = time => {
    window.requestAnimationFrame(gameLoop)

    const width = canvas.width
    const height = canvas.height

    context.clearRect(0, 0, width, height)

    formicary.update()

    formicaryRenderer.render(formicary)
    formicaryRenderer.update(cursor)

    let brain = formicary.getFittest().brain
    if (formicaryRenderer.selectedAnt != null) {
      brain = formicaryRenderer.selectedAnt.brain
    }
    controlsRenderer.brain = brain

    neuralNetworkRenderer.render(brain)
    neuralNetworkRenderer.update(cursor)

    controlsRenderer.render()
    controlsRenderer.update(cursor)

    context.drawImage(controlsRenderer.canvas, controlsRenderer.x, controlsRenderer.y)
    context.drawImage(neuralNetworkRenderer.canvas, neuralNetworkRenderer.x, neuralNetworkRenderer.y)
    context.drawImage(formicaryRenderer.canvas, formicaryRenderer.x, formicaryRenderer.y)

    if (cursor.pressed && cursor.released) {
      cursor.clear()
    }
  }

  const setCursorPosition = (/** @type {MouseEvent} */ event) => {
    cursor.x = event.clientX
    cursor.y = event.clientY
  }

  const setCursorPressedPosition = (/** @type {MouseEvent} */ event) => {
    cursor.pressed = new Point(event.clientX, event.clientY)
  }

  const setCursorReleasedPosition = (/** @type {MouseEvent} */ event) => {
    cursor.released = new Point(event.clientX, event.clientY)
  }

  window.addEventListener('resize', fixCanvasSize)
  document.addEventListener('mousemove', setCursorPosition)
  document.addEventListener('mousedown', setCursorPressedPosition)
  document.addEventListener('mouseup', setCursorReleasedPosition)

  fixCanvasSize()
  gameLoop()
})

const buildFormicary = () => {
  const width = 500
  const height = 500
  const anthillX = Math.floor(Math.random() * 400 + 50)
  const anthillY = Math.floor(Math.random() * 400 + 50)
  const anthillRadius = 15
  const population = 10

  const formicary = new Formicary(width, height, anthillX, anthillY, anthillRadius, population)

  const food = 250
  for (let i = 0; i < food; i++) {
    formicary.dropFoodAt(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500), 75)
  }

  return formicary
}
