import React, { useEffect, useState } from 'react';
import { FloatButton, Tabs } from 'antd';
import { PageView } from '../../core/ui/PageView.tsx';
import { BingoBoard } from './components/BingoBoard.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { User } from '../../data/entities/user.ts';
import { TabItem } from '../../data/types/tab-item.ts';
import { EditOutlined, PlayCircleOutlined, MenuOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'

import { BingoPlayerStatistics } from './components/BingoPlayerStatistics.tsx';
import { BingoBoardTile } from '../../data/entities/bingo-board-tile.ts';
import { useEventDetails } from './EventDetailsPage.tsx';
import {
  useLazyGetBingoBoardTilesPeakQuery,
  useLazyGetBingoBoardTilesQuery, useStartEventMutation
} from '../../data/services/api/event-api.ts';
import { SubmitTileModal } from './modals/SubmitTileModal.tsx';
import { SelectTileModal } from './modals/SelectTileModal.tsx';
import generateBlankBingoBoard, { replaceTiles } from '../../data/helpers/bingo-board-generator.ts';
import useTimer from '../../core/hooks/useTimer.ts';
import { TileSubmissionResponseModal } from './modals/TileSubmissionResponseModal.tsx';
import { ConfirmModal } from '../../core/modals/ConfirmModal.tsx';
import { useBreakpoints } from '../../core/hooks/useBreakpoints.ts';

export enum BoardViewType {
  Play,
  Create,
  Manage
}

export function BingoEventDetailsPage() {
  const trigger = useTimer();
  const {event, refetch: refetchEvent} = useEventDetails();
  const {user} = useSelector((state: RootState) => state.user) as { user: User };
  const {floatButtonInset} = useBreakpoints();

  const [getTiles, {data: fullTiles, isFetching: fetchingFullTiles}] = useLazyGetBingoBoardTilesQuery();
  const [getTilesPeak, {data: peakTiles, isFetching: fetchingPeakTile}] = useLazyGetBingoBoardTilesPeakQuery();
  const [startEvent, {isLoading: startEventLoading, error: startEventError, isSuccess: startEventSuccess}] = useStartEventMutation();

  const [showStartEventModal, setShowStartEventModal] = useState(false);
  const [showTileSubmissionResponse, setShowTileSubmissionResponse] = useState(false);
  const [showTileSubmission, setShowTileSubmission] = useState(false);
  const [showTileSelection, setShowTileSelection] = useState(false);
  const [selectedTile, setSelectedTile] = useState<BingoBoardTile>();
  const [boardTiles, setBoardTiles] = useState<BingoBoardTile[]>(generateBlankBingoBoard());
  const [hostView, setHostView] = useState<boolean>(event.hostId === user.id);

  const isFetching = fetchingFullTiles || fetchingPeakTile;
  const isEventHost = event.hostId === user.id;

  function refetchTiles() {
    if (!hostView && !event.started) {
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
    if (startEventSuccess) {
      refetchEvent();
      setShowStartEventModal(false);
    }
  }, [startEventSuccess]);

  useEffect(() => {
    if (event.started && trigger) {
      refetchTiles();
    }
  }, [trigger, event.started]);

  useEffect(() => {
    refetchTiles();
  }, [hostView]);

  useEffect(() => {
    refetchTiles();
  }, []);

  useEffect(() => {
    if (fullTiles && (hostView || event.started)) {
      setBoardTiles((tiles: BingoBoardTile[]) => replaceTiles(tiles, fullTiles))
    }
  }, [fullTiles, hostView, event.started]);

  useEffect(() => {
    if (peakTiles && !hostView && !event.started) {
      setBoardTiles((tiles: BingoBoardTile[]) => replaceTiles(tiles, peakTiles))
    }
  }, [peakTiles, hostView, event.started]);

  const playerBoardTab: TabItem = {
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
  };

  const manageBoardTab: TabItem = {
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
  };

  const createBoardTab: TabItem = {
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
  };

  const playerStatisticsTab: TabItem = {
    key: 'statistics',
    label: 'Player Statistics',
    children: (
      <BingoPlayerStatistics />
    )
  };

  const getVisibleTabs = (): TabItem[] => {
    let tabs: TabItem[] = [];

    if (!hostView) {
      tabs.push(playerBoardTab)
    }

    if (hostView) {
      tabs.push(event.started ? manageBoardTab : createBoardTab);
    }

    if (event.started) {
      tabs.push(playerStatisticsTab);
    }

    return tabs;
  }

  return (
    <>
      <PageView loading={!event}>
        <Tabs
          destroyInactiveTabPane={true}
          defaultActiveKey="1"
          size='small'
          items={getVisibleTabs()}
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

      <ConfirmModal
        title='Begin Event'
        message='Are you sure you want to begin this event?'
        open={showStartEventModal}
        loading={startEventLoading}
        error={startEventError?.message}
        onConfirm={() => startEvent(event.id)}
        onCancel={() => setShowStartEventModal(false)} />

      {isEventHost && (
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ insetInlineEnd: floatButtonInset }}
          icon={<MenuOutlined />}
        >
          {hostView && (
            <>
              <FloatButton icon={<EditOutlined />} />
              {!event.started && (
                <FloatButton
                  onClick={() => setShowStartEventModal(true)}
                  icon={<PlayCircleOutlined />} />
              )}
            </>
          )}
          <FloatButton onClick={() => setHostView(curr => !curr)} icon={hostView ? <EyeOutlined /> : <EyeInvisibleOutlined />} />
        </FloatButton.Group>
      )}
    </>
  )
}