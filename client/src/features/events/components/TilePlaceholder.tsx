import { BingoBoardTile } from '../../../data/entities/bingo-board-tile.ts';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../data/store.ts';
import { User } from '../../../data/entities/user.ts';
import React from 'react';
import { BoardViewType, useEventDetails } from '../EventDetailsPage.tsx';

export function TilePlaceholder({bingoTile, onTileClick}: TilePlaceholderProps) {
  const {user} = useSelector((state: RootState) => state.user) as { user: User };
  const tile = bingoTile.tile;
  const userSubmission = bingoTile.submissions?.find(s => s.appUserId === user.id);
  const submissionApproved = userSubmission?.accepted;
  const {viewType} = useEventDetails();
  const enableClick = viewType != BoardViewType.Play || !userSubmission;

  function handleOnClick() {
    if (!enableClick) return;
    onTileClick(bingoTile);
  }

  const BG_GRAY = 'bg-gray-200';
  const BG_GREEN = 'bg-green-200';
  const BG_BLUE = 'bg-blue-200';
  const TRIANGLE_GRAY = 'bg-gray-500';
  const TRIANGLE_GREEN = 'bg-green-500';
  const TRIANGLE_BLUE = 'bg-blue-500';

  const getColorsForPlayView = (submissionApproved: boolean) => {
    return {
      bgColor: submissionApproved ? BG_GREEN : BG_GRAY,
      triangleColor: submissionApproved ? TRIANGLE_GREEN : TRIANGLE_GRAY
    };
  };

  const getColorsForManageView = (submissionCount: number) => {
    return {
      bgColor: submissionCount > 0 ? BG_BLUE : BG_GRAY,
      triangleColor: submissionCount > 0 ? TRIANGLE_BLUE : TRIANGLE_GRAY
    };
  };

  const SubmissionOverlay: React.FC = () => {
    let bgColor = BG_GRAY;
    let triangleColor = TRIANGLE_GRAY;
    let submissionCount = 0;

    if (viewType === BoardViewType.Play) {
      ({ bgColor, triangleColor } = getColorsForPlayView(submissionApproved));
    } else if (viewType === BoardViewType.Manage) {
      submissionCount = bingoTile.submissions?.filter(s => s.judgeId == undefined).length || 0;
      ({ bgColor, triangleColor } = getColorsForManageView(submissionCount));
    }

    return (
      <div className={`absolute top-0 right-0 bottom-0 left-0 opacity-50 ${bgColor}`}>
        <div className={`absolute top-0 right-0 w-10 h-10 clip-triangle ${triangleColor}`}>
          {submissionCount > 0 && <p className="text-white text-xs p-1 w-1/2 float-right">{submissionCount}</p>}
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={handleOnClick}
      className={'border border-gray-200 rounded-md min-h-32 xl:min-h-48 xl:max-w-48 2xl:min-h-56 2xl:max-w-56 relative' + (enableClick ? ' cursor-pointer' : '')}>
      <div className="flex justify-center items-center h-full">
      {bingoTile.tile ? (
          <div className="flex justify-center items-center gap-2 flex-col rounded p-2">
            <img className="p-0.5" alt="Tile Image" src={tile?.imagePath}/>
            <div className="font-bold text-gray-600 text-center text-sm w-full">{tile?.task}</div>
            {userSubmission && viewType != BoardViewType.Create && <SubmissionOverlay />}
          </div>
        ) : (
          <div className='flex justify-center items-center gap-2 flex-col rounded p-2 max-md:min-h-32'>
            {viewType != BoardViewType.Play && <PlusCircleOutlined className='text-2xl text-gray-600' />}
          </div>
        )}
      </div>
    </div>
  )
}

interface TilePlaceholderProps {
  bingoTile: BingoBoardTile;
  onTileClick: (tile: BingoBoardTile) => void;
}