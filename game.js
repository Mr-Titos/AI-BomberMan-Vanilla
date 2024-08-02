import { grid, numRows, numCols, numSoftWalls, createSoftWallCanvas, createWallCanvas, createOutlineCanvas } from './utils.js';
import { types, entities, cells, Bomb, blowUpBomb, Explosion } from './entities.js';
import { player, performAction } from './player.js';
import { RLAgent } from './reinforcementLearning.js';

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

let last;
let dt;
let gameWin = false;
let state;
let action;
let generation = 0;

const softWallCanvas = createSoftWallCanvas();
const wallCanvas = createWallCanvas();
const outlineCanvas = createOutlineCanvas();

const agent = new RLAgent(numRows * numCols, 24, 5);

const template = [
  ['⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩'],
  ['⛩', 'x', 'x', , , , , , , , , , 'x', 'x', '⛩'],
  ['⛩', 'x', '▉', , '▉', , '▉', , '▉', , '▉', , '▉', 'x', '⛩'],
  ['⛩', 'x', , , , , , , , , , , , 'x', '⛩'],
  ['⛩', , '▉', , '▉', , '▉', , '▉', , '▉', , '▉', , '⛩'],
  ['⛩', , , , , , , , , , , , , , '⛩'],
  ['⛩', , '▉', , '▉', , '▉', , '▉', , '▉', , '▉', , '⛩'],
  ['⛩', , , , , , , , , , , , , , '⛩'],
  ['⛩', , '▉', , '▉', , '▉', , '▉', , '▉', , '▉', , '⛩'],
  ['⛩', 'x', , , , , , , , , , , , 'x', '⛩'],
  ['⛩', 'x', '▉', , '▉', , '▉', , '▉', , '▉', , '▉', 'x', '⛩'],
  ['⛩', 'x', 'x', , , , , , , , , , 'x', 'x', '⛩'],
  ['⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩', '⛩'],
];

const dateStartDiv = document.getElementById('dateStart');
const date = new Date();
const hours = date.getHours().toString().padStart(2, '0');
const minutes = date.getMinutes().toString().padStart(2, '0');
const formattedTime = `${hours}h ${minutes}`;
dateStartDiv.innerText = 'Start : ' + formattedTime;

function generateLevel() {
  cells = [];
  let softWalls = 0;
  let iteration = 0;

  for (let row = 0; row < numRows; row++) {
    cells[row] = [];
  }

  while (softWalls < numSoftWalls) {
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (iteration > 0 && cells[row][col] !== undefined) continue;

        if (
          !template[row][col] &&
          Math.random() < 0.3 &&
          softWalls < numSoftWalls
        ) {
          cells[row][col] = types.softWall;
          softWalls++;
        } else if (template[row][col] === types.wall) {
          cells[row][col] = types.wall;
        } else if (template[row][col] === types.outline) {
          cells[row][col] = types.outline;
        }
      }
    }
    iteration++;
  }
}

function loop(timestamp) {
  requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (!last) {
    last = timestamp;
  }

  dt = timestamp - last;
  last = timestamp;

  let currentSoftWalls = 0;
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      switch (cells[row][col]) {
        case types.wall:
          context.drawImage(wallCanvas, col * grid, row * grid);
          break;
        case types.softWall:
          currentSoftWalls++;
          context.drawImage(softWallCanvas, col * grid, row * grid);
          break;
        case types.outline:
          context.drawImage(outlineCanvas, col * grid, row * grid);
          break;
      }
    }
  }

  if (currentSoftWalls === 0) {
    gameWin = true;
  }

  entities.forEach((entity) => {
    entity.update(dt);
    entity.render(context);
    if (!entity.alive) {
        entities.splice(entities.indexOf(entity), 1);
    }
 });

  //entities = entities.filter((entity) => entity.alive); // doesn't work ?
  player.render(context);

  if (state) {
    const reward = player.alive ? numSoftWalls - currentSoftWalls : (numSoftWalls - currentSoftWalls) - 10;
    const scoreDiv = document.getElementById('score');
    scoreDiv.innerText = 'Score : ' + reward;

    const nextState = agent.getState(cells, numRows, numCols);
    const done = !player.alive || gameWin;
    //console.log('Action:', action, 'Reward:', reward, 'Done:', done);
    agent.remember(state, action, reward, nextState, done);
    agent.trainModel();
    if (done) {
      console.log('Reward :', reward, 'Generation :', generation++);
      const genDiv = document.getElementById('generation');
      genDiv.innerText = 'Generation : ' + generation;
      player.alive = true;
      player.bombKiller = undefined;
      gameWin = false;
      player.clear(context);
      generateLevel();
    }
  }

  state = agent.getState(cells, numRows, numCols);
  action = agent.selectAction(state);
  performAction(action);
}

generateLevel();
requestAnimationFrame(loop);