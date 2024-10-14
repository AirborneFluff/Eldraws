import { useParams } from 'react-router-dom';
import { useGetGuildQuery } from '../../data/services/api/guild-api.ts';
import {useEffect} from 'react';
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
    <PageView
      loading={guildLoading}>
      <Tabs
        destroyInactiveTabPane={true}
        defaultActiveKey="1"
        size='small'
        items={[...tabs, ...adminTabs]}
      />
    </PageView>
  )
}