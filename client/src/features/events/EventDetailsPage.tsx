import React, { useEffect } from 'react';
import { usePage } from '../../core/ui/AppLayout.tsx';
import { useParams } from 'react-router-dom';
import { useGetEventQuery } from '../../data/services/api/event-api.ts';
import { Event, EventType } from '../../data/entities/event.ts';

import { createContext, useContext } from 'react';
import { BingoEventDetailsPage } from './BingoEventDetailsPage.tsx';
import {GuildRoleName} from "../../data/entities/guild-role.ts";
import {useLazyGetUserRoleQuery} from "../../data/services/api/guild-api.ts";
import { RaffleEventDetailsPage } from './RaffleEventDetailsPage.tsx';

interface EventDetailsContextProps {
  event: Event | null;
  refetch: () => void;
  userRole: GuildRoleName;
}

const EventDetailsContext = createContext<EventDetailsContextProps | undefined>(undefined);

export const EventDetailsProvider: React.FC<{
  children: React.ReactNode,
  event: Event | null,
  userRole: GuildRoleName,
  refetch: () => void
}> = ({children, event, refetch, userRole}) => (
  <EventDetailsContext.Provider value={{event, refetch, userRole}}>
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
  const [getUserRole, {data: userRole, isLoading: userRoleLoading}] = useLazyGetUserRoleQuery();

  useEffect(() => {
    setHeaderContent({
      title: "Event Details",
      subtitle: event ? event.title : null,
      backRoute: `/app/guilds/${event?.guildId}`
    });

    if (event) {
      getUserRole(event.guildId);
      addBreadcrumbOverride({
        match: event.id,
        override: event.title
      })
    }
  }, [event]);

  useEffect(() => {
    setLoading(eventLoading || userRoleLoading);
  }, [eventLoading, userRoleLoading]);

  const renderPage =
    event?.type === EventType.Bingo ? (<BingoEventDetailsPage />) :
    event?.type === EventType.Raffle ? (<RaffleEventDetailsPage />) : null;

  return (
    <EventDetailsProvider event={event} refetch={refetch} userRole={userRole?.name}>
      {renderPage}
    </EventDetailsProvider>
  )
}