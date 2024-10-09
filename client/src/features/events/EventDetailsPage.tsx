import { CreateTileModal } from './modals/CreateTileModal.tsx';
import React, { useEffect, useState } from 'react';
import { usePage } from '../../core/ui/AppLayout.tsx';
import { useParams } from 'react-router-dom';
import { Button, DescriptionsProps, Tabs } from 'antd';
import { getEventTypeName } from '../../core/utils/enum-helper.ts';
import { PageView } from '../../core/ui/PageView.tsx';
import { BingoBoard } from './components/BingoBoard.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { User } from '../../data/entities/user.ts';
import { useGetEventQuery } from '../../data/services/api/event-api.ts';
import { TabItem } from '../../data/types/tab-item.ts';
import { Event } from '../../data/entities/event.ts';

import { createContext, useContext } from 'react';

interface EventDetailsContextProps {
  viewType: BoardViewType;
  event: Event | null;
}

export enum BoardViewType {
  Play,
  Create,
  Manage
}

const EventDetailsContext = createContext<EventDetailsContextProps | undefined>(undefined);

export const EventDetailsProvider: React.FC<{
  children: React.ReactNode,
  viewType: BoardViewType,
  event: Event | null
}> = ({children, viewType, event}) => (
  <EventDetailsContext.Provider value={{viewType, event}}>
    {children}
  </EventDetailsContext.Provider>
);

export const useEventDetails = (): EventDetailsContextProps => {
  const context = useContext(EventDetailsContext);
  if (context === undefined) throw new Error('useEventDetails must be used within an EventDetailsProvider');
  return context;
};

export function EventDetailsPage() {
  const {user} = useSelector((state: RootState) => state.user) as { user: User };
  const [showCreateTile, setShowCreateTile] = useState(false);
  const {eventId} = useParams();
  const {setLoading, setHeaderContent, addBreadcrumbOverride} = usePage();
  const {data: event, isLoading: eventLoading} = useGetEventQuery(eventId);
  const isEventHost = event?.hostId == user.id;
  const hasEventStarted = event?.startDate ? Date.parse(event.startDate) < Date.now() : false;

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

  // @ts-ignore
  const eventDescriptionItems: DescriptionsProps['items'] = event ? [
    {key: 1, label: 'Title', children: event.title},
    {key: 2, label: 'Subtitle', children: event.subtitle},
    {key: 3, label: 'Description', children: event.description},
    {key: 4, label: 'Event Type', children: getEventTypeName(event.type)},
  ] : [];

  const tabs: TabItem[] = [
    {
      key: 'eventBoard',
      label: event?.title ?? 'Event',
      children: (
        <PageView loading={!event}>
          <EventDetailsProvider viewType={BoardViewType.Play} event={event}>
            {hasEventStarted ? <BingoBoard /> : (
              <div className='flex justify-center items-center min-h-52'>
                <p className='text-center text-xl'>Event has not begun yet</p>
              </div>
            )}
          </EventDetailsProvider>
        </PageView>
      ),
    }
  ]

  const hostTabs: TabItem[] = isEventHost ? [
    {
      key: 'manage',
      label: 'Manage',
      children: (
        <PageView
          loading={!event}>
          <EventDetailsProvider viewType={BoardViewType.Manage} event={event}>
            <BingoBoard />
          </EventDetailsProvider>
          <CreateTileModal
            guildId={event.guildId}
            open={showCreateTile}
            onSuccess={() => setShowCreateTile(false)}
            onCancel={() => setShowCreateTile(false)} />
        </PageView>
      )
    },
    {
      key: 'create',
      label: 'Create',
      children: (
        <PageView
          loading={!event}
          buttons={[
            <Button onClick={() => setShowCreateTile(true)}>Create a tile</Button>
          ]}>
          <EventDetailsProvider viewType={BoardViewType.Create} event={event}>
            <BingoBoard />
          </EventDetailsProvider>
          <CreateTileModal
            guildId={event.guildId}
            open={showCreateTile}
            onSuccess={() => setShowCreateTile(false)}
            onCancel={() => setShowCreateTile(false)} />
        </PageView>
      )
    },
  ] : [];

  return (
    <Tabs
      destroyInactiveTabPane={true}
      defaultActiveKey="1"
      size='small'
      items={[...tabs, ...hostTabs]}
    />
  )
}