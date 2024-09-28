import { Card, Carousel } from 'antd';
import { TilePlaceholder } from './TilePlaceholder.tsx';
import { BingoBoardTile, GridPosition } from '../../../data/entities/bingo-board-tile.ts';
import { useBreakpoints } from '../../../core/hooks/useBreakpoints.ts';
import { SelectTileModal } from '../modals/SelectTileModal.tsx';
import { useState } from 'react';

export function BingoBoard({guildId}) {
  const {breakpoints} = useBreakpoints();
  const [showSelectTile, setShowSelectTile] = useState(false);
  const generateBingoBoard = (): BingoBoardTile[] => {
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

  const bingoTiles = generateBingoBoard();

  const sortBingoBoardTiles = (tiles: BingoBoardTile[]): BingoBoardTile[] => {
    return tiles.sort((a, b) => {
      if (a.position.row === b.position.row) {
        return a.position.column - b.position.column;
      }
      return a.position.row - b.position.row;
    });
  };

  const orderedTiles = sortBingoBoardTiles(bingoTiles);

  function handleOnAddTileRequest() {
    setShowSelectTile(true);
  }

  return (
    <>
      <Card bordered title='Board'>
        <div className='max-w-[34rem] mx-auto'>
          {breakpoints.md ? (
            <DesktopView tileRows={orderedTiles} onAddTileRequest={handleOnAddTileRequest} />
          ) : (
            <MobileView tileRows={orderedTiles} onAddTileRequest={handleOnAddTileRequest} />
          )}
        </div>
      </Card>
      <SelectTileModal
        guildId={guildId}
        open={showSelectTile}
        onCancel={() => setShowSelectTile(false)} />
    </>
  );
}

function DesktopView({tileRows, onAddTileRequest}: BoardViewProps) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {tileRows.map((tile, rowIndex) => (
        <div className='flex justify-center items-center'>
          <TilePlaceholder position={tile.position} onAddTileRequest={onAddTileRequest} />
        </div>
      ))}
    </div>
  )
}

function MobileView({tileRows, onAddTileRequest}: BoardViewProps) {
  const columns = [0, 1, 2, 3, 4].map((colIndex) =>
    tileRows.filter(tile => tile.position.column === colIndex)
  );

  return (
    <Carousel arrows>
      {columns.map((columnTiles, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-4 items-center">
          {columnTiles.map((tile) => (
            <div key={tile.id} className="flex justify-center items-center">
              <TilePlaceholder position={tile.position} onAddTileRequest={onAddTileRequest} />
            </div>
          ))}
        </div>
      ))}
    </Carousel>
  )
}

export interface BoardViewProps {
  tileRows: BingoBoardTile[],
  onAddTileRequest: (position: GridPosition) => void;
}