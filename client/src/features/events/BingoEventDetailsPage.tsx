import React, { useEffect, useState } from 'react';
import { FloatButton, Tabs } from 'antd';
import { PageView } from '../../core/ui/PageView.tsx';
import { BingoBoard } from './components/BingoBoard.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { User } from '../../data/entities/user.ts';
import { EditOutlined, PlayCircleOutlined, MenuOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'

import { BingoPlayerStatistics } from './components/BingoPlayerStatistics.tsx';
import { BingoBoardTile } from '../../data/entities/bingo-board-tile.ts';
import { useEventDetails } from './EventDetailsPage.tsx';
import { useStartEventMutation } from '../../data/services/api/event-api.ts';
import { SubmitTileModal } from './modals/SubmitTileModal.tsx';
import { SelectTileModal } from './modals/SelectTileModal.tsx';
import generateBlankBingoBoard, { replaceTiles } from '../../data/helpers/bingo-board-generator.ts';
import useTimer from '../../core/hooks/useTimer.ts';
import { TileSubmissionResponseModal } from './modals/TileSubmissionResponseModal.tsx';
import { ConfirmModal } from '../../core/modals/ConfirmModal.tsx';
import { useBreakpoints } from '../../core/hooks/useBreakpoints.ts';
import {GetTabItems, TabItemExtended} from "../../data/models/tab-item-extended.ts";
import {
  useGetBingoEventDetailsQuery,
  useLazyGetBingoBoardTilesPeakQuery,
  useLazyGetBingoBoardTilesQuery
} from '../../data/services/api/bingo-event-api.ts';
import { BingoDetailsProvider } from './providers/bingo-details-provider.tsx';

export enum BoardViewType {
  Play,
  Create,
  Manage
}

export function BingoEventDetailsPage() {
  const trigger = useTimer();
  const {event, userRole, refetch: refetchEvent} = useEventDetails();
  const {user} = useSelector((state: RootState) => state.user) as { user: User };
  const {floatButtonInset} = useBreakpoints();

  const {data: bingoDetails, isFetching: fetchingBingoDetails, refetch: refetchBingoDetails} = useGetBingoEventDetailsQuery(event.id);
  const [getTiles, {data: fullTiles, isFetching: fetchingFullTiles}] = useLazyGetBingoBoardTilesQuery();
  const [getTilesPeak, {data: peakTiles, isFetching: fetchingPeakTile}] = useLazyGetBingoBoardTilesPeakQuery();
  const [startEvent, {isLoading: startEventLoading, error: startEventError, isSuccess: startEventSuccess}] = useStartEventMutation();

  const [showStartEventModal, setShowStartEventModal] = useState(false);
  const [showTileSubmissionResponse, setShowTileSubmissionResponse] = useState(false);
  const [showTileSubmission, setShowTileSubmission] = useState(false);
  const [showTileSelection, setShowTileSelection] = useState(false);
  const [selectedTile, setSelectedTile] = useState<BingoBoardTile>();
  const [boardTiles, setBoardTiles] = useState<BingoBoardTile[]>([]);
  const [hostView, setHostView] = useState<boolean>(event.hostId === user.id);

  const isFetching = fetchingFullTiles || fetchingPeakTile || fetchingBingoDetails;

  function refetchTiles() {
    if (!bingoDetails) return;
    if (boardTiles.length === 0) {
      setBoardTiles(generateBlankBingoBoard(bingoDetails.columnCount, bingoDetails.rowCount));
    }
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
  }, [hostView, bingoDetails]);

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

  const tabs: TabItemExtended[] = [
    {
      key: 'eventBoard',
      label: event?.title ?? 'Event',
      visible: !hostView,
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
      key: 'manage',
      label: 'Manage',
      visible: hostView && event.started,
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
      visible: hostView && !event.started && userRole !== 'Moderator',
      children: (
        <BingoBoard
          refresh={refetchTiles}
          isLoading={isFetching}
          tiles={boardTiles}
          viewType={BoardViewType.Create}
          onTileClick={(tile) => handleShowModal(setShowTileSelection, tile)}
        />
      )
    },
    {
      key: 'statistics',
      label: 'Player Statistics',
      visible: event.started,
      children: (
        <BingoPlayerStatistics />
      )
    }
  ];

  return (
    <BingoDetailsProvider bingoDetails={bingoDetails} refetch={refetchBingoDetails}>
      <PageView loading={!event}>
        <Tabs
          destroyInactiveTabPane={true}
          defaultActiveKey="1"
          size='small'
          items={GetTabItems(tabs)}
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

      {(userRole === 'Admin' || userRole === 'Owner' || (userRole === 'Moderator' && event.started)) && (
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
    </BingoDetailsProvider>
  )
}