import { PageView } from '../../core/ui/PageView.tsx';
import { Button, Descriptions, List } from 'antd';
import { Tile } from '../../data/entities/tile.ts';
import { useGetGuildTilesQuery } from '../../data/services/api/guild-api.ts';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePage } from '../../core/ui/AppLayout.tsx';
import { ManageTileModal } from '../events/modals/ManageTileModal.tsx';

export function ManageGuildTilesPage() {
  const {guildId} = useParams();
  const {setHeaderContent} = usePage();
  const {data: tiles, isFetching, refetch} = useGetGuildTilesQuery(guildId);
  const [showModal, setShowModal] = useState(false);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);

  useEffect(() => {
    setHeaderContent({
      title: "Event Tiles",
      subtitle: "",
      backRoute: `/app/guilds/${guildId}`
    });
  }, []);

  function openTileModal(tile: Tile | null) {
    setSelectedTile(tile);
    setShowModal(true);
  }

  function handleOnSuccess() {
    setShowModal(false);
    refetch();
  }

  return (
    <PageView
      buttons={[
        <Button onClick={() => openTileModal(null)}>Create Tile</Button>,
      ]}>
      <List
        size='small'
        header={<span>Events</span>}
        bordered
        dataSource={tiles}
        renderItem={(item: Tile) =>
          <ListItem
            item={item}
            onClick={openTileModal}
          />}
        loading={isFetching}
      />
      <ManageTileModal
        refetchOnOpen={false}
        guildId={guildId}
        tile={selectedTile}
        open={showModal}
        onSuccess={handleOnSuccess}
        onCancel={() => setShowModal(false)}
      />
    </PageView>
  )
}

interface ListItemProps {
  item: Tile,
  onClick: (item: Tile) => void
}

function ListItem({item, onClick}: ListItemProps) {
  return (
    <List.Item className='hover:bg-gray-200 cursor-pointer !block' onClick={() => onClick(item)}>
      <Descriptions layout="horizontal" size="small">
        <Descriptions.Item>
          <img className="p-0.5" alt="Tile Image" src={item?.imagePath}/>
        </Descriptions.Item>
        <Descriptions.Item className='font-semibold'>{item.task}</Descriptions.Item>
        <Descriptions.Item>{item.description}</Descriptions.Item>
      </Descriptions>
    </List.Item>
  )
}