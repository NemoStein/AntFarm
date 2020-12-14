import { Brain } from '../src/neat/Brain.js'
import { render } from './render.js'

const x = new Brain(3, 2)
x.addSynapseMutation()
for (let i = 0; i < 2; i++) {
  if (Math.random() < 0.5) {
    x.addSynapseMutation()
  } else {
    x.addNeuronMutation()
  }
}

const a = x.clone()
for (let i = 0; i < 2; i++) {
  if (Math.random() < 0.5) {
    a.addSynapseMutation()
  } else {
    a.addNeuronMutation()
  }
}

const b = x.clone()
for (let i = 0; i < 2; i++) {
  if (Math.random() < 0.5) {
    b.addSynapseMutation()
  } else {
    b.addNeuronMutation()
  }
}

const c = Brain.crossover(a, b)

render(x, 'root')
render(a, 'parent1')
render(b, 'parent2')
render(c, 'child')
