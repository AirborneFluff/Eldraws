import { Tile } from '../../../data/entities/tile.ts';
import {PlusCircleOutlined} from "@ant-design/icons";
import { GridPosition } from '../../../data/entities/bingo-board-tile.ts';

export function TilePlaceholder({tile, position, onAddTileRequest}: TilePlaceholderProps) {
  return (
    <div
      onClick={() => onAddTileRequest(position)}
      className='w-24 h-24 border border-gray-200 rounded flex justify-center items-center cursor-pointer'>
      {tile ? (
        <div className='flex justify-center items-center'>

        </div>
      ) : (
        <PlusCircleOutlined
          className='text-2xl text-gray-600' />
      )}
    </div>
  )
}

interface TilePlaceholderProps {
  tile?: Tile | undefined,
  position: GridPosition,
  onAddTileRequest: (position: GridPosition) => void
}