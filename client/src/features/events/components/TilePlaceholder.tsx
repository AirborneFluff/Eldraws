import { BingoBoardTile, GridPosition } from '../../../data/entities/bingo-board-tile.ts';
import { PlusCircleOutlined } from '@ant-design/icons';


export function TilePlaceholder({bingoTile, onAddTileRequest}: TilePlaceholderProps) {
  const tile = bingoTile.tile;

  return (
    <div
      onClick={() => onAddTileRequest(bingoTile.position)}
      className='border border-gray-200 rouned-md cursor-pointer min-h-32 xl:min-h-48 xl:max-w-48 2xl:min-h-56 2xl:max-w-56'>
      <div className='flex justify-center items-center h-full'>
        {bingoTile.tile ? (
          <div className='flex justify-center items-center gap-2 flex-col rounded p-2'>
            <img className='p-0.5' alt='Tile Image' src={tile?.imagePath} />
            <div className='font-bold text-gray-600 text-center text-sm w-full'>{tile?.task}</div>
          </div>
        ) : (
          <div className='flex justify-center items-center gap-2 flex-col rounded p-2 max-md:min-h-32'>
            <PlusCircleOutlined className='text-2xl text-gray-600' />
          </div>
        )}
      </div>
    </div>
  )
}

interface TilePlaceholderProps {
  bingoTile: BingoBoardTile,
  onAddTileRequest: (position: GridPosition) => void
}