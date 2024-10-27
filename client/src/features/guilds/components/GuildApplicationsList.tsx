import { Button, Descriptions, List } from 'antd';
import { CheckOutlined, StopOutlined, CloseOutlined } from '@ant-design/icons';
import { GuildApplication } from '../../../data/entities/guild-application.ts';
import {
  useApplicationResponseMutation,
  useGetGuildApplicationsQuery
} from '../../../data/services/api/guild-api.ts';
import {ApplicationResponseAction} from "../../../data/types/application-response-action.ts";
import {useEffect} from "react";
import {ApplicationResponseBody} from "../../../data/models/application-response-body.ts";
import {PageView} from "../../../core/ui/PageView.tsx";
import {useGuildDetails} from "../GuildDetailsPage.tsx";

export function GuildApplicationsList() {
  const { guild, userRole } = useGuildDetails();
  const {data: applications, isLoading, refetch} = useGetGuildApplicationsQuery(guild?.id);
  const hasActionPermissions = userRole === 'Owner' || userRole === 'Admin';

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
      guildId: guild?.id,
      applicationId: application.id,
      action: action
    };

    respondToApplication(body);
  }

  return (
    <PageView>
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
            hasActionPermissions={hasActionPermissions}
          />}
        loading={isLoading}
      />
    </PageView>
  )
}

interface ListItemProps {
  item: GuildApplication,
  onResponse: (item: GuildApplication, response: ApplicationResponseAction) => void,
  isLoading: boolean,
  hasActionPermissions: boolean
}

function ListItem({item, onResponse, isLoading, hasActionPermissions}: ListItemProps) {
  return (
    <List.Item className='!block'>
      <Descriptions layout='vertical' size='small'>
        <Descriptions.Item label='Username'>{item.userName}</Descriptions.Item>
        <Descriptions.Item label='Gamertag'>{item.gamertag}</Descriptions.Item>
        {hasActionPermissions && (
          <Descriptions.Item label='Actions'>
            <div className='flex gap-1'>
              <Button
                disabled={isLoading}
                shape='circle'
                icon={<CheckOutlined/>}
                onClick={() => onResponse(item, 'accept')}/>
              <Button
                disabled={isLoading}
                shape='circle'
                icon={<CloseOutlined/>}
                onClick={() => onResponse(item, 'reject')}/>
              <Button
                disabled={isLoading}
                danger
                shape='circle'
                icon={<StopOutlined/>}
                onClick={() => onResponse(item, 'blacklist')}/>
            </div>
          </Descriptions.Item>
        )}
      </Descriptions>
    </List.Item>
  )
}