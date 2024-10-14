import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { PageView } from '../../core/ui/PageView.tsx';
import { BingoBoard } from './components/BingoBoard.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { User } from '../../data/entities/user.ts';
import { TabItem } from '../../data/types/tab-item.ts';

import { BingoPlayerStatistics } from './components/BingoPlayerStatistics.tsx';
import { BingoBoardTile } from '../../data/entities/bingo-board-tile.ts';
import { useEventDetails } from './EventDetailsPage.tsx';
import {
  useLazyGetBingoBoardTilesPeakQuery,
  useLazyGetBingoBoardTilesQuery
} from '../../data/services/api/event-api.ts';
import { SubmitTileModal } from './modals/SubmitTileModal.tsx';
import { SelectTileModal } from './modals/SelectTileModal.tsx';
import generateBlankBingoBoard, { replaceTiles } from '../../data/helpers/bingo-board-generator.ts';
import useTimer from '../../core/hooks/useTimer.ts';
import { TileSubmissionResponseModal } from './modals/TileSubmissionResponseModal.tsx';

export enum BoardViewType {
  Play,
  Create,
  Manage
}

export function BingoEventDetailsPage() {
  const trigger = useTimer();
  const {event} = useEventDetails();
  const {user} = useSelector((state: RootState) => state.user) as { user: User };

  const [getTiles, {data: fullTiles, isFetching: fetchingFullTiles}] = useLazyGetBingoBoardTilesQuery();
  const [getTilesPeak, {data: peakTiles, isFetching: fetchingPeakTile}] = useLazyGetBingoBoardTilesPeakQuery();

  const [showTileSubmissionResponse, setShowTileSubmissionResponse] = useState(false);
  const [showTileSubmission, setShowTileSubmission] = useState(false);
  const [showTileSelection, setShowTileSelection] = useState(false);
  const [selectedTile, setSelectedTile] = useState<BingoBoardTile>();
  const [boardTiles, setBoardTiles] = useState<BingoBoardTile[]>(generateBlankBingoBoard());

  const isFetching = fetchingFullTiles || fetchingPeakTile;
  const isEventHost = event.hostId === user.id;
  const eventStarted = event?.startDate ? Date.parse(event.startDate) < Date.now() : false;

  function refetchTiles() {
    if (!isEventHost && !eventStarted) {
      getTilesPeak(event.id);
      return;
    }

    getTiles(event.id);
  }

  function handleShowModal(setShowModal:  React.Dispatch<React.SetStateAction<boolean>>, tile: BingoBoardTile) {
    setShowModal(true);
    setSelectedTile(tile);
  }

  function handleModalSuccess(setShowModal:  React.Dispatch<React.SetStateAction<boolean>>) {
    setShowModal(false);
    refetchTiles();
  }

  useEffect(() => {
    if (eventStarted && trigger) {
      refetchTiles();
    }
  }, [trigger, eventStarted]);

  useEffect(() => {
    refetchTiles();
  }, []);

  useEffect(() => {
    setBoardTiles((tiles: BingoBoardTile[]) => replaceTiles(tiles, fullTiles))
  }, [fullTiles]);

  useEffect(() => {
    setBoardTiles((tiles: BingoBoardTile[]) => replaceTiles(tiles, peakTiles))
  }, [peakTiles]);

  const tabs: TabItem[] = [
    {
      key: 'eventBoard',
      label: event?.title ?? 'Event',
      children: (
        <BingoBoard
          refresh={refetchTiles}
          isLoading={isFetching}
          tiles={boardTiles}
          viewType={BoardViewType.Play}
          onTileClick={(tile) => handleShowModal(setShowTileSubmission, tile)}
        />
      )
    },
    {
      key: 'statistics',
      label: 'Player Statistics',
      children: (
        <BingoPlayerStatistics />
      )
    }
  ]

  const hostTabs: TabItem[] = [
    {
      key: 'manage',
      label: 'Manage',
      children: (
        <BingoBoard
          refresh={refetchTiles}
          isLoading={isFetching}
          tiles={boardTiles}
          viewType={BoardViewType.Manage}
          onTileClick={(tile) => handleShowModal(setShowTileSubmissionResponse, tile)}
        />
      )
    },
    {
      key: 'create',
      label: 'Create',
      children: (
        <BingoBoard
          refresh={refetchTiles}
          isLoading={isFetching}
          tiles={boardTiles}
          viewType={BoardViewType.Create}
          onTileClick={(tile) => handleShowModal(setShowTileSelection, tile)}
        />
      )
    }
  ];

  const visibleTabs = [...tabs, ...(isEventHost ? hostTabs : [])]

  return (
    <PageView loading={!event}>
      <Tabs
        destroyInactiveTabPane={true}
        defaultActiveKey="1"
        size='small'
        items={visibleTabs}
      />
      <SubmitTileModal
        bingoTile={selectedTile}
        open={showTileSubmission}
        onSuccess={() => handleModalSuccess(setShowTileSubmission)}
        onCancel={() => setShowTileSubmission(false)}
      />
      <SelectTileModal
        bingoTile={selectedTile}
        open={showTileSelection}
        onSuccess={() => handleModalSuccess(setShowTileSelection)}
        onCancel={() => setShowTileSelection(false)}
      />
      <TileSubmissionResponseModal
        bingoTile={selectedTile}
        open={showTileSubmissionResponse}
        onSuccess={() => handleModalSuccess(setShowTileSubmissionResponse)}
        onCancel={() => setShowTileSubmissionResponse(false)} />
    </PageView>
  )
}