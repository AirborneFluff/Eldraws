import { BingoBoardTile } from '../entities/bingo-board-tile.ts';

const generateBlankBingoBoard = (columns: number = 5, rows: number = 5): BingoBoardTile[] => {
  const tiles: BingoBoardTile[] = [];

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      tiles.push({
        id: `${row}-${column}`,
        tile: null,
        position: {
          row: row,
          column: column
        },
        submissions: []
      });
    }
  }

  return tiles;
};

export const replaceTiles = (tiles: BingoBoardTile[], replacementTiles: BingoBoardTile[] | undefined): BingoBoardTile[] => {
  return tiles.map((currentTile) => {
    const tile = replacementTiles?.find(t => t.position.column === currentTile.position.column && t.position.row === currentTile.position.row);
    return tile ?? currentTile;
  });
};

export default generateBlankBingoBoard;
