import { useParams } from 'react-router-dom';
import { useGetGuildQuery } from '../../data/services/api/guild-api.ts';
import React, {createContext, useContext, useEffect} from 'react';
import { usePage } from '../../core/ui/AppLayout.tsx';
import { Tabs } from 'antd';
import { TabItem } from '../../data/types/tab-item.ts';
import { GuildApplicationsList } from './components/GuildApplicationsList.tsx';
import {useSelector} from "react-redux";
import {RootState} from "../../data/store.ts";
import {User} from "../../data/entities/user.ts";
import {GuildEventsList} from "./components/GuildEventsList.tsx";
import {GuildMembersList} from "./components/GuildMembersList.tsx";
import {GuildBlacklistList} from "./components/GuildBlacklistList.tsx";
import { PageView } from '../../core/ui/PageView.tsx';
import {Guild} from "../../data/entities/guild.ts";

interface GuildDetailsContextProps {
  guild: Guild | null;
  isOwner: boolean;
}

const GuildDetailsContext = createContext<GuildDetailsContextProps | undefined>(undefined);

export const GuildDetailsProvider: React.FC<{
  children: React.ReactNode,
  guild: Guild | null,
  isOwner: boolean
}> = ({children, guild, isOwner}) => (
  <GuildDetailsContext.Provider value={{guild, isOwner}}>
    {children}
  </GuildDetailsContext.Provider>
);

export const useGuildDetails = (): GuildDetailsContextProps => {
  const context = useContext(GuildDetailsContext);
  if (context === undefined) throw new Error('useGuildDetails must be used within an GuildDetailsProvider');
  return context;
};

export function GuildDetailsPage() {
  const {user} = useSelector((state: RootState) => state.user) as { user: User };
  const {guildId} = useParams();
  const {setLoading, setHeaderContent, addBreadcrumbOverride} = usePage();
  const {data: guild, isLoading: guildLoading} = useGetGuildQuery(guildId);
  const isGuildOwner = guild?.ownerId === user.id;

  useEffect(() => {
    setHeaderContent({
      title: "Guild Details",
      subtitle: guild ? guild.name : null,
      backRoute: `/app/guilds`
    });

    if (guild) {
      addBreadcrumbOverride({
        match: guild.id,
        override: guild.name
      })
    }
  }, [guild]);

  useEffect(() => {
    setLoading(guildLoading);
  }, [guildLoading]);

  const tabs: TabItem[] = [
    {
      key: 'events',
      label: 'Events',
      children: <GuildEventsList />,
    }
  ]

  const adminTabs: TabItem[] = isGuildOwner ? [
    {
      key: 'applications',
      label: 'Applications',
      children: <GuildApplicationsList />
    },
    {
      key: 'members',
      label: 'Members',
      children: <GuildMembersList />
    },
    {
      key: 'blacklist',
      label: 'Blacklist',
      children: <GuildBlacklistList />
    }
  ] : [];

  return (
    <GuildDetailsProvider guild={guild} isOwner={isGuildOwner}>
      <PageView
        loading={guildLoading}>
        <Tabs
          destroyInactiveTabPane={true}
          defaultActiveKey="1"
          size='small'
          items={[...tabs, ...adminTabs]}
        />
      </PageView>
    </GuildDetailsProvider>
  )
}