import { BingoBoardTile } from '../../../data/entities/bingo-board-tile.ts';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../data/store.ts';
import { User } from '../../../data/entities/user.ts';

export function TilePlaceholder({bingoTile, onTileClick, isEditable}: TilePlaceholderProps) {
  const {user} = useSelector((state: RootState) => state.user) as { user: User };
  const tile = bingoTile.tile;
  const hasSubmission = !!bingoTile.submissions?.find(s => s.appUserId === user.id);
  const enableClick = (isEditable || !!bingoTile.tile) && !hasSubmission;

  function handleOnClick() {
    if (!enableClick) return;
    onTileClick(bingoTile);
  }

  return (
    <div
      onClick={handleOnClick}
      className={"border border-gray-200 rounded-md min-h-32 xl:min-h-48 xl:max-w-48 2xl:min-h-56 2xl:max-w-56" + (enableClick? ' cursor-pointer' : '')} >
      <div className='flex justify-center items-center h-full'>
        {bingoTile.tile ? (
          <div className='flex justify-center items-center gap-2 flex-col rounded p-2'>
            <img className='p-0.5' alt='Tile Image' src={tile?.imagePath} />
            <div className='font-bold text-gray-600 text-center text-sm w-full'>{tile?.task}</div>
          </div>
        ) : (
          <div className='flex justify-center items-center gap-2 flex-col rounded p-2 max-md:min-h-32'>
            {isEditable && <PlusCircleOutlined className='text-2xl text-gray-600' />}
          </div>
        )}
      </div>
    </div>
  )
}

interface TilePlaceholderProps {
  bingoTile: BingoBoardTile,
  onTileClick: (tile: BingoBoardTile) => void,
  isEditable: boolean
}