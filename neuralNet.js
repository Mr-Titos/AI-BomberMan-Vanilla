export class NeuralNetwork {
    constructor(inputSize, hiddenSize, outputSize) {
      this.inputSize = inputSize;
      this.hiddenSize = hiddenSize;
      this.outputSize = outputSize;
      this.weightsIH = new Array(this.hiddenSize).fill().map(() => new Array(this.inputSize).fill().map(() => Math.random() * 2 - 1));
      this.weightsHO = new Array(this.outputSize).fill().map(() => new Array(this.hiddenSize).fill().map(() => Math.random() * 2 - 1));
      this.biasH = new Array(this.hiddenSize).fill().map(() => Math.random() * 2 - 1);
      this.biasO = new Array(this.outputSize).fill().map(() => Math.random() * 2 - 1);
    }
  
    sigmoid(x) {
      return 1 / (1 + Math.exp(-x));
    }
  
    dsigmoid(y) {
      return y * (1 - y);
    }
  
    feedforward(inputArray) {
      let inputs = inputArray;
      let hidden = this.weightsIH.map(row => row.reduce((sum, weight, i) => sum + weight * inputs[i], 0));
      hidden = hidden.map((sum, i) => this.sigmoid(sum + this.biasH[i]));
      let outputs = this.weightsHO.map(row => row.reduce((sum, weight, i) => sum + weight * hidden[i], 0));
      outputs = outputs.map((sum, i) => this.sigmoid(sum + this.biasO[i]));
      return outputs;
    }
  
    train(inputArray, targetArray) {
      let inputs = inputArray;
      let hidden = this.weightsIH.map(row => row.reduce((sum, weight, i) => sum + weight * inputs[i], 0));
      hidden = hidden.map((sum, i) => this.sigmoid(sum + this.biasH[i]));
      let outputs = this.weightsHO.map(row => row.reduce((sum, weight, i) => sum + weight * hidden[i], 0));
      outputs = outputs.map((sum, i) => this.sigmoid(sum + this.biasO[i]));
  
      let targets = targetArray;
      let outputErrors = outputs.map((output, i) => targets[i] - output);
  
      let gradients = outputs.map((output, i) => outputErrors[i] * this.dsigmoid(output));
      gradients = gradients.map(gradient => gradient * 0.1);
      let hiddenErrors = new Array(this.hiddenSize).fill(0);
  
      this.weightsHO.forEach((row, i) => {
        row.forEach((weight, j) => {
          hiddenErrors[j] += weight * outputErrors[i];
          this.weightsHO[i][j] += gradients[i] * hidden[j];
        });
        this.biasO[i] += gradients[i];
      });
  
      let hiddenGradients = hidden.map((hiddenNode, i) => hiddenErrors[i] * this.dsigmoid(hiddenNode));
      hiddenGradients = hiddenGradients.map(gradient => gradient * 0.1);
  
      this.weightsIH.forEach((row, i) => {
        row.forEach((weight, j) => {
          this.weightsIH[i][j] += hiddenGradients[i] * inputs[j];
        });
        this.biasH[i] += hiddenGradients[i];
      });
    }
  }
  