export const grid = 64;
export const numRows = 13;
export const numCols = 15;
export const numSoftWalls = 60;

export function createSoftWallCanvas() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.height = grid;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, grid, grid);
  ctx.fillStyle = '#a0530c';
  ctx.fillRect(1, 1, grid - 2, 20);
  ctx.fillRect(0, 23, 20, 18);
  ctx.fillRect(22, 23, 42, 18);
  ctx.fillRect(0, 43, 42, 20);
  ctx.fillRect(44, 43, 20, 20);
  return canvas;
}

export function createWallCanvas() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.height = grid;
  ctx.fillStyle = '#121211';
  ctx.fillRect(0, 0, grid, grid);
  ctx.fillStyle = '#212120';
  ctx.fillRect(0, 0, grid - 2, grid - 2);
  ctx.fillStyle = '#1c1c1b';
  ctx.fillRect(2, 2, grid - 4, grid - 4);
  return canvas;
}

export function createOutlineCanvas() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.height = grid;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, grid - 2, grid, 2);
  ctx.fillStyle = '#c93e2e';
  ctx.fillRect(0, 0, grid - 2, grid - 2);
  ctx.fillStyle = '#991203';
  ctx.fillRect(2, 2, grid - 4, grid - 4);
  return canvas;
}
