import { useSelector } from 'react-redux';
import { RootState } from '../../../data/store.ts';
import { Alert, Button, List, Tooltip } from 'antd';
import { Guild } from '../../../data/models/guild.ts';
import { CrownOutlined, StopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useApplicationResponseMutation, useDeleteGuildMutation } from '../../../data/services/api/guild-api.ts';


export default function GuildsList({guilds, isLoading, isError}) {
  const {user} = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [deleteGuild, {
    isLoading: isResponseLoading,
    isSuccess: isResponseSuccess
  }] = useDeleteGuildMutation();

  function handleItemClick(guild: Guild) {
    navigate(guild.id)
  }

  function handleOnItemDelete(guild: Guild) {
    deleteGuild(guild.id);
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
          onGuildDelete={handleOnItemDelete}
        />}
      loading={isLoading}
      footer={isError && <Alert
        description='There was a problem contacting the server'
        type='error'
      />}
    />
  );
}

function GuildListItem({item, userId, onClick, onGuildDelete}) {
  const isOwner = userId === item.ownerId;

  function handleOnDeletePressed(e) {
    e.stopPropagation();
    onGuildDelete(item);
  }

  return (
    <List.Item
      onClick={() => onClick(item)}
      className='hover:bg-gray-200 cursor-pointer'>
      <div className='flex justify-between items-center w-full'>
        <div className='flex justify-center items-center gap-4'>
          {isOwner && <CrownOutlined/>}
          <span>{item.name}</span>
        </div>
        {isOwner &&
          <Tooltip title='Delete Guild'>
            <Button
              disabled={false}
              danger
              shape='circle'
              icon={<StopOutlined />}
              onClick={handleOnDeletePressed} />
          </Tooltip>
        }
      </div>
    </List.Item>
  )
}