import { useSelector } from 'react-redux';
import { RootState } from '../../../data/store.ts';
import { Alert, Button, List } from 'antd';
import { Guild } from '../../../data/entities/guild.ts';
import { CrownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PageView } from '../../../core/ui/PageView.tsx';
import { JoinGuildModal } from '../modals/JoinGuildModal.tsx';
import { CreateGuildModal } from '../modals/CreateGuildModal.tsx';
import { useState } from 'react';
import { useGetUserGuildsQuery } from '../../../data/services/api/guild-api.ts';
import { ListHeader } from '../../../core/components/ListHeader.tsx';

export default function GuildsList() {
  const {data: guilds, isFetching, isError, refetch} = useGetUserGuildsQuery();
  const {user} = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [ showGuildSearchModal, setShowGuildSearchModal ] = useState(false);
  const [ showCreate, setShowCreate ] = useState(false);

  function handleItemClick(guild: Guild) {
    navigate(guild.id)
  }

  function onCreateGuildSuccess() {
    setShowCreate(false);
    refetch();
  }

  return (
    <PageView
      buttons={[
        <Button onClick={() => setShowCreate(true)}>Create Guild</Button>,
        <Button onClick={() => setShowGuildSearchModal(true)}>Find Guild</Button>
      ]}>
      <List
        size='large'
        header={<ListHeader title='Your Guilds' isLoading={isFetching} onRefresh={refetch} />}
        bordered
        dataSource={guilds}
        renderItem={(item: Guild) =>
          <GuildListItem
            item={item}
            userId={user.id}
            onClick={handleItemClick}
          />}
        loading={isFetching}
        footer={isError && <Alert
          description='There was a problem contacting the server'
          type='error'
        />}
      />
      <JoinGuildModal
        open={showGuildSearchModal}
        onSuccess={() => setShowGuildSearchModal(false)}
        onCancel={() => setShowGuildSearchModal(false)} />
      <CreateGuildModal
        open={showCreate}
        onSuccess={onCreateGuildSuccess}
        onCancel={() => setShowCreate(false)} />
    </PageView>
  );
}

function GuildListItem({item, userId, onClick}: {item: Guild, userId: string, onClick: (guild: Guild) => void}) {
  const isOwner = userId === item.creatorId;

  return (
    <List.Item
      onClick={() => onClick(item)}
      className='hover:bg-gray-200 cursor-pointer'>
      <div className='flex justify-between items-center w-full'>
        <div className='flex justify-center items-center gap-4'>
          {isOwner && <CrownOutlined/>}
          <span>{item.name}</span>
        </div>
      </div>
    </List.Item>
  )
}