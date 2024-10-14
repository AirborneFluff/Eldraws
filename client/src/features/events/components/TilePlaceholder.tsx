import {BingoBoardTile} from '../../../data/entities/bingo-board-tile.ts';
import {PlusCircleOutlined} from '@ant-design/icons';
import {useSelector} from 'react-redux';
import {RootState} from '../../../data/store.ts';
import {User} from '../../../data/entities/user.ts';
import React from 'react';
import { BoardViewType } from '../BingoEventDetailsPage.tsx';

export function TilePlaceholder({viewType, bingoTile, onTileClick}: TilePlaceholderProps) {
  const {user} = useSelector((state: RootState) => state.user) as { user: User };
  const tile = bingoTile.tile;
  const tileSubmissions =  [...(bingoTile?.submissions ?? [])];
  const latestUserSubmission = tileSubmissions.find(s => s.appUserId === user.id);
  const unresolvedSubmissions = tileSubmissions.filter(s => s.judgeId == undefined) ?? [];

  function handleOnClick() {
    if (!clickEnabled()) return;
    onTileClick(bingoTile);
  }

  const BG_GRAY = 'bg-gray-200';
  const BG_GREEN = 'bg-green-200';
  const BG_BLUE = 'bg-blue-200';
  const BG_RED = 'bg-red-200';
  const TRIANGLE_GRAY = 'bg-gray-500';
  const TRIANGLE_GREEN = 'bg-green-500';
  const TRIANGLE_BLUE = 'bg-blue-500';
  const TRIANGLE_RED = 'bg-red-500';

  const getColorsForPlayView = () => {
    if (latestUserSubmission?.judgeId == null) {
      return {
        bgColor: BG_GRAY,
        triangleColor: TRIANGLE_GRAY
      };
    }
    return {
      bgColor: latestUserSubmission.accepted ? BG_GREEN : BG_RED,
      triangleColor: latestUserSubmission.accepted ? TRIANGLE_GREEN : TRIANGLE_RED
    };
  };

  const getColorsForManageView = () => {
    return {
      bgColor: unresolvedSubmissions.length > 0 ? BG_BLUE : BG_GRAY,
      triangleColor: unresolvedSubmissions.length > 0 ? TRIANGLE_BLUE : TRIANGLE_GRAY
    };
  };

  const SubmissionOverlay: React.FC = () => {
    const submissionCount = unresolvedSubmissions.length;
    const colors = viewType === BoardViewType.Play ? getColorsForPlayView() : getColorsForManageView();
    const bgColor = colors.bgColor;
    const triangleColor = colors.triangleColor;

    return (
      <div className={`absolute top-0 right-0 bottom-0 left-0 opacity-50 ${bgColor}`}>
        <div className={`absolute top-0 right-0 w-10 h-10 clip-triangle ${triangleColor}`}>
          {submissionCount > 0 && viewType === BoardViewType.Manage && (
            <p className="text-white text-xs p-1 w-1/2 float-right">{submissionCount}</p>
          )}
        </div>
      </div>
    );
  };

  const overlayVisible = () => {
    if (viewType === BoardViewType.Play) {
      return !!latestUserSubmission;
    }

    if (viewType === BoardViewType.Manage) {
      return unresolvedSubmissions.length > 0;
    }
  }

  const clickEnabled = () => {
    if (viewType === BoardViewType.Play) {
      if (!bingoTile?.tile || !bingoTile?.tile?.task) return false;
      return !latestUserSubmission || !latestUserSubmission.accepted && latestUserSubmission.judgeId != undefined;
    }

    if (viewType === BoardViewType.Manage) {
      return unresolvedSubmissions.length > 0;
    }

    if (viewType === BoardViewType.Create) {
      return true;
    }
  }

  const blurTiles = tile?.task == null;

  return (
    <div
      onClick={handleOnClick}
      className={'border border-gray-200 rounded-md min-h-32 xl:min-h-48 xl:max-w-48 2xl:min-h-56 2xl:max-w-56 relative' + (clickEnabled() ? ' cursor-pointer' : '')}>
      <div className="flex justify-center items-center h-full">
        {bingoTile.tile ? (
          <div
            className={`flex justify-center items-center gap-2 flex-col rounded p-2 ${blurTiles ? 'blur-md' : ''}`}>
            <img className="p-0.5" alt="Tile Image" src={tile?.imagePath}/>
            <div className="font-bold text-gray-600 text-center text-sm w-full">{tile?.task}</div>
            {overlayVisible() && <SubmissionOverlay/>}
          </div>
        ) : (
          <div className='flex justify-center items-center gap-2 flex-col rounded p-2 max-md:min-h-32'>
            {viewType == BoardViewType.Create && <PlusCircleOutlined className='text-2xl text-gray-600'/>}
          </div>
        )}
      </div>
    </div>
  )
}

interface TilePlaceholderProps {
  bingoTile: BingoBoardTile;
  onTileClick: (tile: BingoBoardTile) => void;
  viewType: BoardViewType;
}