import { Card, Modal, Space, Spin } from 'antd';
import { useGetGuildTilesQuery } from '../../../data/services/api/guild-api.ts';
import { Tile } from '../../../data/entities/tile.ts';

export function SelectTileModal({guildId, open, onSelect, onCancel}) {
  const {data, isLoading, isError, error} = useGetGuildTilesQuery(guildId);
  const tiles = data as Tile[];

  return (
    <Modal
      title="Select a tile"
      open={open}
      okText='Create'
      onOk={() => null}
      onCancel={onCancel}
    >
      <Card className='flex justify-center items-center'>
        {isLoading ? (
          <Spin size='large' />
        ) : (
          <Space size={8} wrap className='justify-between max-h-36 sm:max-h-96  overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
            {tiles?.map((tile, index) =>
              <div className='flex justify-center items-center gap-2 flex-col cursor-pointer border-gray-200 border rounded w-24 min-h-24'>
                <img className='p-0.5' alt='Tile Image' src={tile.imagePath} />
                <div className='font-bold text-gray-600 text-center text-sm'>{tile.task}</div>
              </div>
            )}
          </Space>
        )}
      </Card>
    </Modal>
  )
}

