import { Button, Card, Descriptions, List, Space, Tooltip } from 'antd';
import { CheckOutlined, StopOutlined, CloseOutlined } from '@ant-design/icons';
import { GuildApplication } from '../../../data/models/guild-application.ts';
import { useGetGuildApplicationsQuery } from '../../../data/services/api/guild-api.ts';

export function GuildApplicationsList({guildId}) {
  const {data: applications, isLoading, isError} = useGetGuildApplicationsQuery(guildId, {
    skip: guildId == undefined
  });

  function handleItemClick(application: GuildApplication) {
    console.log(application.userName)
  }

  return (
    <List
      size='large'
      header={<span>Your Applications</span>}
      bordered
      dataSource={applications}
      renderItem={(item: GuildApplication) =>
        <ListItem
          item={item}
          onClick={handleItemClick}
        />}
      loading={isLoading}
    />
  )
}

interface ListItemProps {
  item: GuildApplication,
  onClick: (item: GuildApplication) => void;
}

function ListItem({item, onClick}: ListItemProps) {
  return (
    <List.Item
      onClick={() => onClick(item)}
      className='hover:bg-gray-200 !block'>
      <Descriptions layout='vertical' bordered size='small' title={item.userName}>
        <Descriptions.Item label='Email'>{item.email}</Descriptions.Item>
        <Descriptions.Item label='Actions'>
          <Space>
            <Button shape='circle' icon={<CheckOutlined />} />
            <Button shape='circle' icon={<CloseOutlined />} />
            <Button danger shape='circle' icon={<StopOutlined />} />
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </List.Item>
  )
}