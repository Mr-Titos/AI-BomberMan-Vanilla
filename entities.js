import { grid } from './utils.js';
import { scoreNumber } from './game.js';
import { player } from './player.js';

export const types = {
  outline: '⛩',
  wall: '▉',
  softWall: 1,
  bomb: 2,
};

export let cells = [];
export let entities = [];

export class Bomb {
  constructor(row, col, size, owner) {
    this.row = row;
    this.col = col;
    this.radius = grid * 0.4;
    this.size = size;
    this.owner = owner;
    this.alive = true;
    this.type = types.bomb;
    this.timer = 500;
  }

  update(dt) {
    this.timer -= dt;
    if (this.timer <= 0) {
      return blowUpBomb(this);
    }
    const interval = Math.ceil(this.timer / 500);
    this.radius = interval % 2 === 0 ? grid * 0.4 : grid * 0.5;
  }

  render(context) {
    const x = (this.col + 0.5) * grid;
    const y = (this.row + 0.5) * grid;
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(x, y, this.radius, 0, 2 * Math.PI);
    context.fill();
    const fuseY = this.radius === grid * 0.5 ? grid * 0.15 : 0;
    context.strokeStyle = 'white';
    context.lineWidth = 5;
    context.beginPath();
    context.arc(
      (this.col + 0.75) * grid,
      (this.row + 0.25) * grid - fuseY,
      10,
      Math.PI,
      -Math.PI / 2
    );
    context.stroke();
  }
}

export class Explosion {
  constructor(row, col, dir, center) {
    this.row = row;
    this.col = col;
    this.dir = dir;
    this.alive = true;
    this.timer = 300;
    this.center = center;
  }

  update(dt) {
    this.timer -= dt;
    if (this.timer <= 0) {
      this.alive = false;
    }
  }

  render(context) {
    const x = this.col * grid;
    const y = this.row * grid;
    const horizontal = this.dir.col;
    const vertical = this.dir.row;
    context.fillStyle = '#D72B16'; // red
    context.fillRect(x, y, grid, grid);
    context.fillStyle = '#F39642'; // orange
    if (horizontal || this.center) {
      context.fillRect(x, y + 6, grid, grid - 12);
    }
    if (vertical || this.center) {
      context.fillRect(x + 6, y, grid - 12, grid);
    }
    context.fillStyle = '#FFE5A8'; // yellow
    if (horizontal || this.center) {
      context.fillRect(x, y + 12, grid, grid - 24);
    }
    if (vertical || this.center) {
      context.fillRect(x + 12, y, grid - 24, grid);
    }
  }
}

export function blowUpBomb(bomb) {
  if (!bomb.alive) return;

  bomb.alive = false;
  cells[bomb.row][bomb.col] = null;

  const dirs = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 },  // right
  ];

  dirs.forEach((dir) => {
    for (let i = 0; i < bomb.size; i++) {
      const row = bomb.row + dir.row * i;
      const col = bomb.col + dir.col * i;
      const cell = cells[row][col];

      if (cell === types.wall || cell === types.outline) return;

      entities.push(new Explosion(row, col, dir, i === 0));
      cells[row][col] = null;

      if (cell === types.bomb) {
        const nextBomb = entities.find(
          (entity) => entity.type === types.bomb && entity.row === row && entity.col === col
        );
        blowUpBomb(nextBomb);
      }

      if (col === player.col && row === player.row) {
        player.alive = false;
        player.bombKiller = bomb;
        return;
      }

      if (cell) {
        // if (cell === types.softWall) {
        //     scoreNumber += 10;
        //     const scoreDiv = document.getElementById('score');
        //     scoreDiv.innerText = 'Score : ' + scoreNumber;
        // }
        return;
      }
    }
  });
}
