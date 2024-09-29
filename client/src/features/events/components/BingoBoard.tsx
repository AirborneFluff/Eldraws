import { Card, Carousel } from 'antd';
import { TilePlaceholder } from './TilePlaceholder.tsx';
import { BingoBoardTile, GridPosition } from '../../../data/entities/bingo-board-tile.ts';
import { useBreakpoints } from '../../../core/hooks/useBreakpoints.ts';
import { SelectTileModal } from '../modals/SelectTileModal.tsx';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetBingoBoardTilesQuery } from '../../../data/services/api/event-api.ts';
import generateBlankBingoBoard from '../../../data/helpers/bingo-board-generator.ts';
import { SubmitTileModal } from '../modals/SubmitTileModal.tsx';

export function BingoBoard({guildId, isHost}) {
  const {eventId} = useParams();
  const {breakpoints} = useBreakpoints();
  const [selectedBingoTile, setSelectedBingoTile] = useState<BingoBoardTile | undefined>(undefined);
  const {data, refetch, isLoading, isError, error} = useGetBingoBoardTilesQuery(eventId);
  const [boardTiles, setBoardTiles] = useState<BingoBoardTile[]>(generateBlankBingoBoard());
  const showModal = selectedBingoTile != undefined;

  function handleOnAddTileRequest(tile: BingoBoardTile) {
    setSelectedBingoTile(tile);
  }

  function onSelectTileSuccess() {
    setSelectedBingoTile(undefined);
    refetch();
  }

  useEffect(() => {
    const dataTiles = data as BingoBoardTile[];
    setBoardTiles((tiles: BingoBoardTile[]) => {
      return tiles.map((currentTile) => {
        const tile = dataTiles?.find(t => t.position.column === currentTile.position.column && t.position.row === currentTile.position.row);
        return tile ?? currentTile;
      })
    })
  }, [data]);

  return (
    <>
      <Card bordered title='Board'>
        {breakpoints.md ? (
          <DesktopView bingoTiles={boardTiles} onAddTileRequest={handleOnAddTileRequest} />
        ) : (
          <MobileView bingoTiles={boardTiles} onAddTileRequest={handleOnAddTileRequest} />
        )}
      </Card>
      {isHost ? (
        <SelectTileModal
          selectedBingoTile={selectedBingoTile}
          guildId={guildId}
          open={showModal}
          onCancel={() => setSelectedBingoTile(undefined)}
          onSuccess={onSelectTileSuccess}/>
      ) : (
        <SubmitTileModal
          selectedBingoTile={selectedBingoTile}
          guildId={guildId}
          open={showModal}
          onCancel={() => setSelectedBingoTile(undefined)}
          onSuccess={onSelectTileSuccess}/>
      )}
    </>
  );
}

function DesktopView({bingoTiles, onAddTileRequest}: BoardViewProps) {
  return (
    <div className='grid grid-cols-5 gap-2 items-stretch'>
      {bingoTiles?.map((tile, rowIndex) => (
        <TilePlaceholder bingoTile={tile} onAddTileRequest={onAddTileRequest} />
      ))}
    </div>
  )
}

function MobileView({bingoTiles, onAddTileRequest}: BoardViewProps) {
  const columns = [0, 1, 2, 3, 4].map((colIndex) =>
    bingoTiles?.filter(tile => tile.position.column === colIndex)
  );

  return (
    <Carousel arrows infinite={false}>
      {columns.map((columnTiles, columnIndex) => (
        <div key={columnIndex}>
          <p className='text-center mb-6 text-xl font-medium'>Column {columnIndex + 1}</p>
          {columnTiles?.map((tile) => (
            <div className='max-w-48 mx-auto my-2'>
              <TilePlaceholder bingoTile={tile} onAddTileRequest={onAddTileRequest} />
            </div>
          ))}
        </div>
      ))}
    </Carousel>
  )
}

export interface BoardViewProps {
  bingoTiles: BingoBoardTile[],
  onAddTileRequest: (position: GridPosition) => void;
}