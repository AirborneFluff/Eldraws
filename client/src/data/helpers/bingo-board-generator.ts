import { BingoBoardTile } from '../entities/bingo-board-tile.ts';

const generateBlankBingoBoard = (): BingoBoardTile[] => {
  const tiles: BingoBoardTile[] = [];

  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      tiles.push({
        id: `${row}-${column}`,
        tile: null,
        position: {
          row: row,
          column: column
        }
      });
    }
  }

  return tiles;
};

export default generateBlankBingoBoard;
