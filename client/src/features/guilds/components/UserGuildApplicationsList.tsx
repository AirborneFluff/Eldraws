import { Alert, Descriptions, List } from 'antd';
import { GuildApplication } from '../../../data/entities/guild-application.ts';
import {
  useGetUserGuildApplicationsQuery
} from '../../../data/services/api/guild-api.ts';
import {PageView} from "../../../core/ui/PageView.tsx";
import { ListHeader } from '../../../core/components/ListHeader.tsx';

export function UserGuildApplicationsList() {
  const {data: userApplications, isFetching, refetch, isError} = useGetUserGuildApplicationsQuery();

  return (
    <PageView>
      <List
        size='large'
        header={<ListHeader title='Your Applications' isLoading={isFetching} onRefresh={refetch} />}
        bordered
        dataSource={userApplications}
        renderItem={(item: GuildApplication) => <ListItem item={item} />}
        loading={isFetching}
        footer={isError && <Alert
          description='There was a problem contacting the server'
          type='error'
        />}
      />
    </PageView>
  )
}

interface ListItemProps {
  item: GuildApplication
}

function ListItem({item}: ListItemProps) {
  return (
    <List.Item className='!block'>
      <Descriptions layout='vertical' size='small'>
        <Descriptions.Item label='Guild Name'>{item.guild.name}</Descriptions.Item>
        <Descriptions.Item label='Status'>Pending Approval</Descriptions.Item>
      </Descriptions>
    </List.Item>
  )
}