import { Tile } from '../../../data/entities/tile.ts';
import { Card, Typography } from 'antd';
const { Text } = Typography;

export function TileView({tile}: {tile: Tile}) {
  return (
    <Card title={tile.task}>
      <div className='flex justify-center items-center gap-4 flex-col min-w-28'>
        <img
          className='w-8'
          src={tile?.imagePath}
        />
        <Text strong className='text-center'>{tile.description}</Text>
      </div>
    </Card>
  )
}