import { Button, Descriptions, List, Space } from 'antd';
import { CheckOutlined, StopOutlined, CloseOutlined } from '@ant-design/icons';
import { GuildApplication } from '../../../data/models/guild-application.ts';
import {
  useApplicationResponseMutation,
  useGetGuildApplicationsQuery
} from '../../../data/services/api/guild-api.ts';
import {ApplicationResponseAction} from "../../../data/types/application-response-action.ts";
import {useEffect} from "react";
import {ApplicationResponseBody} from "../../../data/models/application-response-body.ts";

export function GuildApplicationsList({guildId}) {
  const {data, isLoading, refetch} = useGetGuildApplicationsQuery(guildId, {
    skip: guildId == undefined
  });
  const applications = data as GuildApplication[];

  const [respondToApplication, {
    isLoading: isResponseLoading,
    isSuccess: isResponseSuccess
  }] = useApplicationResponseMutation();

  useEffect(() => {
    if (!isResponseSuccess) return;
    refetch();
  }, [isResponseSuccess]);

  function handleResponse(application: GuildApplication, action: ApplicationResponseAction) {
    const body: ApplicationResponseBody = {
      guildId: guildId,
      applicationId: application.id,
      action: action
    };

    respondToApplication(body);
  }

  return (
    <List
      size='large'
      header={<span>Your Applications</span>}
      bordered
      dataSource={applications}
      renderItem={(item: GuildApplication) =>
        <ListItem
          isLoading={isResponseLoading}
          item={item}
          onResponse={handleResponse}
        />}
      loading={isLoading || !guildId}
    />
  )
}

interface ListItemProps {
  item: GuildApplication,
  onResponse: (item: GuildApplication, response: ApplicationResponseAction) => void,
  isLoading: boolean
}

function ListItem({item, onResponse, isLoading}: ListItemProps) {
  return (
    <List.Item className='!block'>
      <Descriptions layout='vertical' bordered size='small' title={item.userName}>
        <Descriptions.Item label='Email'>{item.email}</Descriptions.Item>
        <Descriptions.Item label='Actions'>
          <Space>
            <Button
              disabled={isLoading}
              shape='circle'
              icon={<CheckOutlined />}
              onClick={() => onResponse(item, 'accept')} />
            <Button
              disabled={isLoading}
              shape='circle'
              icon={<CloseOutlined />}
              onClick={() => onResponse(item, 'reject')} />
            <Button
              disabled={isLoading}
              danger
              shape='circle'
              icon={<StopOutlined />}
              onClick={() => onResponse(item, 'blacklist')} />
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </List.Item>
  )
}