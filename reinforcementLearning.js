import { NeuralNetwork } from './neuralNet.js';

export class RLAgent {
  constructor(inputSize, hiddenSize, outputSize) {
    this.brain = new NeuralNetwork(inputSize, hiddenSize, outputSize);
    this.memory = [];
    this.gamma = 0.9;
    this.epsilon = 0.1;
  }

  getState(cells, numRows, numCols) {
    let state = [];
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        state.push(cells[row][col] ? 1 : 0);
      }
    }
    return state;
  }

  selectAction(state) {
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * 5);
    } else {
      let predictions = this.brain.feedforward(state);
      return predictions.indexOf(Math.max(...predictions));
    }
  }

  remember(state, action, reward, nextState, done) {
    this.memory.push({ state, action, reward, nextState, done });
  }

  replay(batchSize) {
    let batch = this.memory.slice(-batchSize);
    batch.forEach(({ state, action, reward, nextState, done }) => {
      let target = reward;
      if (!done) {
        let predictions = this.brain.feedforward(nextState);
        target += this.gamma * Math.max(...predictions);
      }
      let targets = this.brain.feedforward(state);
      targets[action] = target;
      this.brain.train(state, targets);
    });
  }

  trainModel(batchSize = 32) {
    if (this.memory.length >= batchSize) {
      this.replay(batchSize);
    }
  }
}
