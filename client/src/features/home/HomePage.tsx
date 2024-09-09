import { useGetUserGuildsQuery } from '../../data/services/api/guild-api.ts';
import { Alert, List } from 'antd';
import { Guild } from '../../data/models/guild.ts';
import { CrownOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';

export function HomePage() {

  return (
    <div>
      <GuildsList />
    </div>
  )
}

function GuildsList() {
  const { data: guilds, isLoading, isError } = useGetUserGuildsQuery();
  const { user } = useSelector((state: RootState) => state.user);

  const footer = isError ? (
    <Alert
      description='There was a problem contacting the server'
      type='error'
    />
  ) : null;

  return (
    <List
      size='large'
      header={<span>Guilds</span>}
      bordered
      dataSource={guilds}
      renderItem={(item: Guild) => <GuildListItem item={item} userId={user.id} />}
      loading={isLoading}
      footer={footer}
    />
  );
}

function GuildListItem({item, userId}) {
  return (
    <List.Item className='hover:bg-gray-200 cursor-pointer'>
      <div className='flex justify-center items-center gap-4'>
        {userId === item.ownerId && <CrownOutlined />}
        <span>{item.name}</span>
      </div>
    </List.Item>
  )
}