import { useSelector } from 'react-redux';
import { RootState } from '../../../data/store.ts';
import { Alert, List } from 'antd';
import { Guild } from '../../../data/entities/guild.ts';
import { CrownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function GuildsList({guilds, isLoading, isError}) {
  const {user} = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  function handleItemClick(guild: Guild) {
    navigate(guild.id)
  }

  return (
    <List
      size='large'
      header={<span>Your Guilds</span>}
      bordered
      dataSource={guilds}
      renderItem={(item: Guild) =>
        <GuildListItem
          item={item}
          userId={user.id}
          onClick={handleItemClick}
        />}
      loading={isLoading}
      footer={isError && <Alert
        description='There was a problem contacting the server'
        type='error'
      />}
    />
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