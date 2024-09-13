import { useParams } from 'react-router-dom';
import { Guild } from '../../data/entities/guild.ts';
import { useGetGuildQuery } from '../../data/services/api/guild-api.ts';
import { useEffect } from 'react';
import { usePage } from '../../core/ui/AppLayout.tsx';
import { Tabs } from 'antd';
import { TabItem } from '../../data/types/tab-item.ts';
import { GuildApplicationsList } from './components/GuildApplicationsList.tsx';
import {useSelector} from "react-redux";
import {RootState} from "../../data/store.ts";
import {User} from "../../data/entities/user.ts";
import {GuildEventsList} from "./components/GuildEventsList.tsx";
import {GuildMembersList} from "./components/GuildMembersList.tsx";

export function GuildDetailsPage() {
  const {user} = useSelector((state: RootState) => state.user) as { user: User };
  const {guildId} = useParams();
  const {setLoading, setHeaderContent} = usePage();
  const {data, isLoading: guildLoading, isError: guildError, refetch} = useGetGuildQuery<Guild>(guildId);
  const guild = data as Guild;
  const isGuildOwner = guild?.ownerId === user.id;

  useEffect(() => {
    setHeaderContent({
      title: "Guild Details",
      subtitle: guild ? guild.name : null
    })
  }, [guild]);

  useEffect(() => {
    setLoading(guildLoading);
  }, [guildLoading]);

  const tabs: TabItem[] = [
    {
      key: 'events',
      label: 'Current Events',
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
    }
  ] : [];

  return (
    <>
      <Tabs
        destroyInactiveTabPane={true}
        defaultActiveKey="1"
        size='large'
        items={[...tabs, ...adminTabs]}
      />
    </>
  )
}