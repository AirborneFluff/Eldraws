import React, { useEffect } from 'react';
import { usePage } from '../../core/ui/AppLayout.tsx';
import { useParams } from 'react-router-dom';
import { useGetEventQuery } from '../../data/services/api/event-api.ts';
import { Event, EventType } from '../../data/entities/event.ts';

import { createContext, useContext } from 'react';
import { BingoEventDetailsPage } from './BingoEventDetailsPage.tsx';

interface EventDetailsContextProps {
  event: Event | null;
  refetch: () => void;
}

const EventDetailsContext = createContext<EventDetailsContextProps | undefined>(undefined);

export const EventDetailsProvider: React.FC<{
  children: React.ReactNode,
  event: Event | null,
  refetch: () => void
}> = ({children, event, refetch}) => (
  <EventDetailsContext.Provider value={{event, refetch}}>
    {children}
  </EventDetailsContext.Provider>
);

export const useEventDetails = (): EventDetailsContextProps => {
  const context = useContext(EventDetailsContext);
  if (context === undefined) throw new Error('useEventDetails must be used within an EventDetailsProvider');
  return context;
};

export function EventDetailsPage() {
  const {eventId} = useParams();
  const {setLoading, setHeaderContent, addBreadcrumbOverride} = usePage();
  const {data: event, isLoading: eventLoading, refetch} = useGetEventQuery(eventId);

  useEffect(() => {
    setHeaderContent({
      title: "Event Details",
      subtitle: event ? event.title : null,
      backRoute: `/app/guilds/${event?.guildId}`
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

  const renderPage =
    event?.type === EventType.Bingo ? (<BingoEventDetailsPage />) :
    event?.type === EventType.TileRace ? (<></>) : null;

  return (
    <EventDetailsProvider event={event} refetch={refetch}>
      {renderPage}
    </EventDetailsProvider>
  )
}