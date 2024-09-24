import { CreateTileModal } from './modals/CreateTileModal.tsx';
import { useEffect, useState } from 'react';
import { usePage } from '../../core/ui/AppLayout.tsx';
import { useParams } from 'react-router-dom';
import { Event } from '../../data/entities/event.ts';
import { useGetEventQuery } from '../../data/services/api/event-api.ts';
import { Button, Descriptions, DescriptionsProps } from 'antd';
import { getEventTypeName } from '../../core/utils/enum-helper.ts';
import { ListView } from '../../core/ui/ListView.tsx';

export function EventDetailsPage() {
  const [showCreateTile, setShowCreateTile] = useState(false);
  const {eventId} = useParams();
  const {setLoading, setHeaderContent, addBreadcrumbOverride} = usePage();
  const {data, isLoading: eventLoading, isError: eventError, refetch} = useGetEventQuery(eventId);
  const event = data as Event;

  useEffect(() => {
    setHeaderContent({
      title: "Event Details",
      subtitle: event ? event.title : null
    });

    if (event) {
      addBreadcrumbOverride({
        match: event.id,
        override: event.title
      })
    }
  }, [event]);

  useEffect(() => {
    setLoading(eventLoading);
  }, [eventLoading]);

  const eventDescriptionItems: DescriptionsProps['items'] = event ? [
    {key: 1, label: 'Title', children: event.title},
    {key: 2, label: 'Subtitle', children: event.subtitle},
    {key: 3, label: 'Description', children: event.description},
    {key: 4, label: 'Event Type', children: getEventTypeName(event.type)},
  ] : []

  return (
    <ListView
      buttons={[
        <Button onClick={() => setShowCreateTile(true)}>Create a tile</Button>
      ]}>
      <Descriptions size='small' bordered items={eventDescriptionItems} />

      <CreateTileModal
        open={showCreateTile}
        onSuccess={() => null}
        onCancel={() => setShowCreateTile(false)} />
    </ListView>
  )
}