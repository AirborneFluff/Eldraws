import {Button, Descriptions, List} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useGetGuildEventsQuery} from "../../../data/services/api/guild-api.ts";
import {Event} from "../../../data/entities/event.ts";
import {ListView} from "../../../core/ui/ListView.tsx";

export function GuildEventsList() {
  const {guildId} = useParams();
  const {data, isLoading, refetch} = useGetGuildEventsQuery(guildId);
  const events = data as Event[];
  const navigate = useNavigate();
  // todo refetch on new event created

  function handleOnClick(item: Event) {
  }

  return (
    <>
      <Button onClick={() => navigate("events/create")}>Create Event</Button>
      <ListView>
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
          loading={isLoading}
        />
      </ListView>
    </>
  )
}

interface ListItemProps {
  item: Event,
  onClick: (item: Event) => void
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