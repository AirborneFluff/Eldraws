import {Button, Descriptions, List} from "antd";
import { useLocation, useNavigate } from 'react-router-dom';
import {useGetGuildEventsQuery} from "../../../data/services/api/guild-api.ts";
import {Event} from "../../../data/entities/event.ts";
import {PageView} from "../../../core/ui/PageView.tsx";
import { useEffect } from 'react';
import {useGuildDetails} from "../GuildDetailsPage.tsx";

export function GuildEventsList() {
  const {guild, userRole} = useGuildDetails();
  const {data, isFetching, refetch} = useGetGuildEventsQuery(guild?.id);
  const events = data as Event[];
  const navigate = useNavigate();
  const locationState = useLocation().state as GuildEventListNavigationState;
  const hasAdminPermissions = userRole === 'Owner' || userRole === 'Admin';

  useEffect(() => {
    if (locationState?.refetch) {
      refetch();
    }
  }, []);

  function handleOnClick(item: Event) {
    navigate(`/app/events/${item.id}`)
  }

  const headerButtons = hasAdminPermissions ? [
    <Button onClick={() => navigate("events/create")}>Create Event</Button>,
    <Button onClick={() => navigate("tiles")}>Manage Event Tiles</Button>,
    <Button disabled={isFetching} onClick={refetch}>Refresh</Button>
  ] : [];

  return (
    <PageView
      buttons={headerButtons}>
      <List
        size='large'
        header={<span>Events</span>}
        bordered
        dataSource={events}
        renderItem={(item: Event) =>
          <ListItem
            item={item}
            onClick={handleOnClick}
          />}
        loading={isFetching}
      />
    </PageView>
  )
}

interface ListItemProps {
  item: Event,
  onClick: (item: Event) => void
}

export interface GuildEventListNavigationState {
  refetch: boolean
}

function ListItem({item, onClick}: ListItemProps) {
  return (
    <List.Item className='hover:bg-gray-200 cursor-pointer !block' onClick={() => onClick(item)}>
      <Descriptions layout='vertical' size='small'>
        <Descriptions.Item label='Title'>{item.title}</Descriptions.Item>
      </Descriptions>
    </List.Item>
  )
}