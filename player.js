import { types, entities, cells, Bomb } from './entities.js';
import { grid } from './utils.js';

export const player = {
  row: 1,
  col: 1,
  alive: true,
  bombKiller: undefined,
  numBombs: 1,
  bombSize: 3,
  radius: grid * 0.35,
  render(context) {
    const x = (this.col + 0.5) * grid;
    const y = (this.row + 0.5) * grid;
    context.save();
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(x, y, this.radius, 0, 2 * Math.PI);
    context.fill();
  },
  clear(context) {
    const x = this.col * grid;
    const y = this.row * grid;
    context.clearRect(x, y, grid, grid);
    this.row = 1;
    this.col = 1;
  },
};

export function performAction(action) {
  let row = player.row;
  let col = player.col;

  switch (action) {
    case 0:
      col--;
      break;
    case 1:
      row--;
      break;
    case 2:
      col++;
      break;
    case 3:
      row++;
      break;
    case 4: // Place bomb
      if (
        !cells[row][col] &&
        entities.filter(
          (entity) => entity.type === types.bomb && entity.owner === player
        ).length < player.numBombs
      ) {
        const bomb = new Bomb(row, col, player.bombSize, player);
        entities.push(bomb);
        cells[row][col] = types.bomb;
      }
      break;
    default:
      console.error('Invalid action:', action);
      break;
  }

  if (!cells[row][col]) {
    player.row = row;
    player.col = col;
  }
}

document.addEventListener('keydown', function (e) {
  const actionMap = {
    37: 0, // left arrow key
    38: 1, // up arrow key
    39: 2, // right arrow key
    40: 3, // down arrow key
    32: 4, // space key
  };

  if (actionMap[e.which] !== undefined) {
    const action = actionMap[e.which];
    performAction(action);
  }
});
