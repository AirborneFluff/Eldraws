import { Button, Card, Carousel } from 'antd';
import { TilePlaceholder } from './TilePlaceholder.tsx';
import { BingoBoardTile } from '../../../data/entities/bingo-board-tile.ts';
import { useBreakpoints } from '../../../core/hooks/useBreakpoints.ts';
import { useEventDetails } from '../EventDetailsPage.tsx';
import { BoardViewType } from '../BingoEventDetailsPage.tsx';
import { useBingoDetails } from '../providers/bingo-details-provider.tsx';

interface BingoBoardProps {
  onTileClick: (tile: BingoBoardTile) => void,
  viewType: BoardViewType,
  isLoading: boolean,
  tiles: BingoBoardTile[],
  refresh: () => void
}

export function BingoBoard({tiles, onTileClick, viewType, refresh, isLoading}: BingoBoardProps) {
  const {event} = useEventDetails();
  const {breakpoints} = useBreakpoints();

  return (
    <>
      <Card
        title={`Bingo Board - ${BoardViewType[viewType]}`}
        bordered
        extra={<Button disabled={isLoading || !event.started} onClick={refresh}>Refresh</Button>}
      >
        {breakpoints.md ? (
          <DesktopView
            viewType={viewType}
            bingoTiles={tiles}
            onTileClick={onTileClick}/>
        ) : (
          <MobileView
            viewType={viewType}
            bingoTiles={tiles}
            onTileClick={onTileClick}/>
        )}
      </Card>
    </>
  );
}

function DesktopView({bingoTiles, onTileClick, viewType}: BoardViewProps) {
  const {bingoDetails} = useBingoDetails();
  const gridCols =
    bingoDetails?.columnCount === 4 ? `grid-cols-4` :
    bingoDetails?.columnCount === 3 ? `grid-cols-3` : `grid-cols-5`;


  return (
    <div className={`grid gap-2 items-stretch ${gridCols}`}>
      {bingoTiles?.map((tile, rowIndex) => (
        <div className="flex justify-center w-full">
          <TilePlaceholder
            viewType={viewType}
            key={rowIndex}
            bingoTile={tile}
            onTileClick={onTileClick}/>
        </div>
      ))}
    </div>
  )
}

function MobileView({bingoTiles, onTileClick, viewType}: BoardViewProps) {
  const {bingoDetails} = useBingoDetails();

  const getColumnsArray = (): number[] => {
    const columnCount = bingoDetails?.columnCount ?? 5;
    return Array.from({ length: columnCount }, (_, index) => index);
  };

  const columns = getColumnsArray().map((colIndex) =>
    bingoTiles?.filter(tile => tile.position.column === colIndex)
  );

  return (
    <Carousel arrows infinite={false}>
      {columns.map((columnTiles, columnIndex) => (
        <div key={columnIndex}>
          <p className='text-center mb-6 text-xl font-medium'>Column {columnIndex + 1}</p>
          {columnTiles?.map((tile, index) => (
            <div key={tile.id} className='max-w-48 mx-auto my-2'>
              <TilePlaceholder
                viewType={viewType}
                key={index}
                bingoTile={tile}
                onTileClick={onTileClick}/>
            </div>
          ))}
        </div>
      ))}
    </Carousel>
  )
}

export interface BoardViewProps {
  bingoTiles: BingoBoardTile[];
  onTileClick: (tile: BingoBoardTile) => void;
  viewType: BoardViewType;
}