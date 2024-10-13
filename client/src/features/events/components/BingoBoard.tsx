import { Button, Card, Carousel } from 'antd';
import { TilePlaceholder } from './TilePlaceholder.tsx';
import { BingoBoardTile } from '../../../data/entities/bingo-board-tile.ts';
import { useBreakpoints } from '../../../core/hooks/useBreakpoints.ts';
import { useEffect, useState } from 'react';
import {
  useLazyGetBingoBoardTilesPeakQuery,
  useLazyGetBingoBoardTilesQuery
} from '../../../data/services/api/event-api.ts';
import generateBlankBingoBoard from '../../../data/helpers/bingo-board-generator.ts';
import { TileSubmissionResponseModal } from '../modals/TileSubmissionResponseModal.tsx';
import { BoardViewType, useEventDetails } from '../EventDetailsPage.tsx';
import { SelectTileModal } from '../modals/SelectTileModal.tsx';
import { SubmitTileModal } from '../modals/SubmitTileModal.tsx';
import useTimer from '../../../core/hooks/useTimer.ts';

export function BingoBoard() {
  const trigger = useTimer();
  const {event, viewType} = useEventDetails();
  const {breakpoints} = useBreakpoints();
  const [selectedBingoTile, setSelectedBingoTile] = useState<BingoBoardTile | undefined>(undefined);
  const [getTiles, {data, isFetching}] = useLazyGetBingoBoardTilesQuery();
  const [getTilesPeak, {data: peakTiles}] = useLazyGetBingoBoardTilesPeakQuery();
  const [boardTiles, setBoardTiles] = useState<BingoBoardTile[]>(generateBlankBingoBoard());
  const showModal = selectedBingoTile != undefined;
  const eventStarted = event?.startDate ? Date.parse(event.startDate) < Date.now() : false;

  useEffect(() => {
    if (eventStarted && trigger) {
      getTiles(event.id);
    }
  }, [trigger, eventStarted]);

  useEffect(() => {
    if (eventStarted || viewType !== BoardViewType.Play) {
      getTiles(event.id);
      return;
    }

    getTilesPeak(event.id);
  }, [eventStarted, event, viewType]);

  function handleOnTileClick(tile: BingoBoardTile) {
    setSelectedBingoTile(tile);
  }

  function onSelectTileSuccess() {
    setSelectedBingoTile(undefined);
    getTiles(event.id);
  }

  function onSubmitTileSuccess() {
    setSelectedBingoTile(undefined);
    getTiles(event.id);
  }

  useEffect(() => {
    if (eventStarted || viewType !== BoardViewType.Play) {
      setBoardTiles((tiles: BingoBoardTile[]) => {
        return tiles.map((currentTile) => {
          const tile = data?.find(t => t.position.column === currentTile.position.column && t.position.row === currentTile.position.row);
          return tile ?? currentTile;
        })
      })
      return;
    }

    setBoardTiles((tiles: BingoBoardTile[]) => {
      return tiles.map((currentTile) => {
        const tile = peakTiles?.find(t => t.position.column === currentTile.position.column && t.position.row === currentTile.position.row);
        return tile ?? currentTile;
      })
    })
  }, [data, peakTiles]);

  return (
    <>
      <Card
        title='Board'
        bordered
        extra={<Button disabled={isFetching || !eventStarted} onClick={() => getTiles(event.id)}>Refresh</Button >}
      >
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
      {eventStarted && (
        <>
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
            <div key={tile.id} className='max-w-48 mx-auto my-2'>
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