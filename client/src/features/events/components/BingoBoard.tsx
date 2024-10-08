import { Card, Carousel } from 'antd';
import { TilePlaceholder } from './TilePlaceholder.tsx';
import { BingoBoardTile } from '../../../data/entities/bingo-board-tile.ts';
import { useBreakpoints } from '../../../core/hooks/useBreakpoints.ts';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetBingoBoardTilesQuery } from '../../../data/services/api/event-api.ts';
import generateBlankBingoBoard from '../../../data/helpers/bingo-board-generator.ts';
import { TileSubmissionResponseModal } from '../modals/TileSubmissionResponseModal.tsx';
import { BoardViewType, useEventDetails } from '../EventDetailsPage.tsx';
import { SelectTileModal } from '../modals/SelectTileModal.tsx';
import { SubmitTileModal } from '../modals/SubmitTileModal.tsx';

export function BingoBoard() {
  const {eventId} = useParams();
  const {breakpoints} = useBreakpoints();
  const [selectedBingoTile, setSelectedBingoTile] = useState<BingoBoardTile | undefined>(undefined);
  const {data, refetch} = useGetBingoBoardTilesQuery(eventId);
  const [boardTiles, setBoardTiles] = useState<BingoBoardTile[]>(generateBlankBingoBoard());
  const {viewType} = useEventDetails();
  const showModal = selectedBingoTile != undefined;

  function handleOnTileClick(tile: BingoBoardTile) {
    setSelectedBingoTile(tile);
  }

  function onSelectTileSuccess() {
    setSelectedBingoTile(undefined);
    refetch();
  }

  function onSubmitTileSuccess() {
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
          <DesktopView
            bingoTiles={boardTiles}
            onTileClick={handleOnTileClick} />
        ) : (
          <MobileView
            bingoTiles={boardTiles}
            onTileClick={handleOnTileClick} />
        )}
      </Card>
      {viewType == BoardViewType.Create && (
        <SelectTileModal
          selectedBingoTile={selectedBingoTile}
          open={showModal}
          onCancel={() => setSelectedBingoTile(undefined)}
          onSuccess={onSelectTileSuccess}/>
      )}
      {viewType == BoardViewType.Manage && (
        <TileSubmissionResponseModal
          selectedBingoTile={selectedBingoTile}
          open={showModal}
          onCancel={() => setSelectedBingoTile(undefined)}
          onSuccess={onSelectTileSuccess} />
      )}
      {viewType == BoardViewType.Play && (
        <SubmitTileModal
          bingoTile={selectedBingoTile}
          open={showModal}
          onSuccess={onSubmitTileSuccess}
          onCancel={() => setSelectedBingoTile(undefined)} />
      )}
    </>
  );
}

function DesktopView({bingoTiles, onTileClick}: BoardViewProps) {
  return (
    <div className='grid grid-cols-5 gap-2 items-stretch'>
      {bingoTiles?.map((tile, rowIndex) => (
        <TilePlaceholder
          key={rowIndex}
          bingoTile={tile}
          onTileClick={onTileClick} />
      ))}
    </div>
  )
}

function MobileView({bingoTiles, onTileClick}: BoardViewProps) {
  const columns = [0, 1, 2, 3, 4].map((colIndex) =>
    bingoTiles?.filter(tile => tile.position.column === colIndex)
  );

  return (
    <Carousel arrows infinite={false}>
      {columns.map((columnTiles, columnIndex) => (
        <div key={columnIndex}>
          <p className='text-center mb-6 text-xl font-medium'>Column {columnIndex + 1}</p>
          {columnTiles?.map((tile, index) => (
            <div className='max-w-48 mx-auto my-2'>
              <TilePlaceholder
                key={index}
                bingoTile={tile}
                onTileClick={onTileClick} />
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
}