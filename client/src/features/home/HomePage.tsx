import {useGetUserGuildsQuery} from '../../data/services/api/guild-api.ts';
import { Alert, Button, List } from 'antd';
import {Guild} from '../../data/models/guild.ts';
import {CrownOutlined} from '@ant-design/icons';
import {useSelector} from 'react-redux';
import {RootState} from '../../data/store.ts';
import {JoinGuildModal} from "../guilds/modals/JoinGuildModal.tsx";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function HomePage() {
  const [ showSearch, setShowSearch ] = useState(false);
  const navigate = useNavigate();

  function hideModal() {
    setShowSearch(false)
  }

  return (
    <div>
      <Button onClick={() => navigate("/app/guilds/create")}>Create Guild</Button>
      <Button onClick={() => setShowSearch(true)}>Search Guild</Button>
      <GuildsList />
      <JoinGuildModal open={showSearch} onSuccess={hideModal} onCancel={hideModal} />
    </div>
  )
}

function GuildsList() {
  const {data: guilds, isLoading, isError} = useGetUserGuildsQuery();
  const {user} = useSelector((state: RootState) => state.user);

  const buildFooter = () => {
    if (isLoading) return null;
    if (isError) return (
      <Alert
        description='There was a problem contacting the server'
        type='error'
      />
    )

    if (guilds?.length > 0) return null;

    return (
      <Alert
        description="It's a bit lonely here, maybe you sure try join a Guild, or Create one"
        type='info'
      />
    )
  }

  return (
    <List
      size='large'
      header={<span>Guilds</span>}
      bordered
      dataSource={guilds}
      renderItem={(item: Guild) => <GuildListItem item={item} userId={user.id}/>}
      loading={isLoading}
      footer={buildFooter()}
    />
  );
}

function GuildListItem({item, userId}) {
  return (
    <List.Item className='hover:bg-gray-200 cursor-pointer'>
      <div className='flex justify-center items-center gap-4'>
        {userId === item.ownerId && <CrownOutlined/>}
        <span>{item.name}</span>
      </div>
    </List.Item>
  )
}