export function calculateCellPosition(params: {
    cellSize: number;
    cellBorderSize: number;
    x: number;
    y: number;
}) {
  const xx = params.x + params.cellSize/2 * Math.sign(params.x);
  const yy = params.y + params.cellSize/2 * Math.sign(params.y);
  const x = (xx - (xx % params.cellSize)) - params.cellBorderSize;
  const y = (yy - (yy % params.cellSize)) - params.cellBorderSize;
  return { x, y };
}
