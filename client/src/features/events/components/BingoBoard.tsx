import { Card, Carousel, Col, Row, Space } from 'antd';
import { Tile } from '../../../data/entities/tile.ts';
import { TilePlaceholder } from './TilePlaceholder.tsx';
import { BingoBoardTile } from '../../../data/entities/bingo-board-tile.ts';
import { useBreakpoints } from '../../../core/hooks/useBreakpoints.ts';

export function BingoBoard({tiles}: {tiles: Tile[]}) {
  const {breakpoints} = useBreakpoints();
  const generateBingoBoard = (): BingoBoardTile[] => {
    const tiles: BingoBoardTile[] = [];

    for (let row = 0; row < 5; row++) {
      for (let column = 0; column < 5; column++) {
        tiles.push({
          id: `${row}-${column}`, // unique id using row and column
          tile: null,              // null tile for now
          column: column,          // column 0 to 4
          row: row,                // row 0 to 4
        });
      }
    }

    return tiles;
  };

  const bingoTiles = generateBingoBoard();

  const sortBingoBoardTiles = (tiles: BingoBoardTile[]): BingoBoardTile[] => {
    return tiles.sort((a, b) => {
      if (a.row === b.row) {
        // If the rows are the same, compare by column
        return a.column - b.column;
      }
      // Otherwise, compare by row
      return a.row - b.row;
    });
  };

  const orderedTiles = sortBingoBoardTiles(bingoTiles);

  return (
    <Card bordered title='Board'>
      <div className='max-w-[34rem] mx-auto'>
        {breakpoints.md ? (
          <DesktopView tileRows={orderedTiles} />
        ) : (
          <MobileView tileRows={orderedTiles} />
        )}
      </div>
    </Card>
  );
}

function DesktopView({tileRows}) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {tileRows.map((tile, rowIndex) => (
        <div className='flex justify-center items-center'>
          <TilePlaceholder row={tile.row} col={tile.column} />
        </div>
      ))}
    </div>
  )
}

function MobileView({tileRows}) {
  const columns = [0, 1, 2, 3, 4].map((colIndex) =>
    tileRows.filter(tile => tile.column === colIndex)
  );

  return (
    <Carousel arrows>
      {columns.map((columnTiles, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-4 items-center">
          {columnTiles.map((tile) => (
            <div key={tile.id} className="flex justify-center items-center">
              <TilePlaceholder row={tile.row} col={tile.column} />
            </div>
          ))}
        </div>
      ))}
    </Carousel>
  )
}