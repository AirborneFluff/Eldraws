import { useSelector } from 'react-redux';
import { RootState } from '../../../data/store.ts';
import { Alert, List } from 'antd';
import { Guild } from '../../../data/models/guild.ts';
import { CrownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


export default function GuildsList({guilds, isLoading, isError}) {
  const {user} = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

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
      footer={buildFooter()}
    />
  );
}

function GuildListItem({item, userId, onClick}) {
  return (
    <List.Item
      onClick={() => onClick(item)}
      className='hover:bg-gray-200 cursor-pointer'>
      <div className='flex justify-center items-center gap-4'>
        {userId === item.ownerId && <CrownOutlined/>}
        <span>{item.name}</span>
      </div>
    </List.Item>
  )
}