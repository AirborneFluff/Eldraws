import {useNavigate, useParams} from 'react-router-dom';
import { useGetGuildQuery } from '../../data/services/api/guild-api.ts';
import {useEffect, useState} from 'react';
import { usePage } from '../../core/ui/AppLayout.tsx';
import {Button, Tabs} from 'antd';
import { TabItem } from '../../data/types/tab-item.ts';
import { GuildApplicationsList } from './components/GuildApplicationsList.tsx';
import {useSelector} from "react-redux";
import {RootState} from "../../data/store.ts";
import {User} from "../../data/entities/user.ts";
import {GuildEventsList} from "./components/GuildEventsList.tsx";
import {GuildMembersList} from "./components/GuildMembersList.tsx";
import {GuildBlacklistList} from "./components/GuildBlacklistList.tsx";
import {ArchiveGuildModal} from "./modals/ArchiveGuildModal.tsx";

export function GuildDetailsPage() {
  const {user} = useSelector((state: RootState) => state.user) as { user: User };
  const {guildId} = useParams();
  const {setLoading, setHeaderContent, addBreadcrumbOverride} = usePage();
  const {data: guild, isLoading: guildLoading} = useGetGuildQuery(guildId);
  const isGuildOwner = guild?.ownerId === user.id;
  const [showArchiveGuildModal, setShowArchiveGuildModal]= useState(false);
  const navigate = useNavigate();

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

  function onArchiveGuild() {
    navigate('/app/guilds');
  }

  return (
    <>
      <Tabs
        destroyInactiveTabPane={true}
        defaultActiveKey="1"
        size='small'

        items={[...tabs, ...adminTabs]}
        tabBarExtraContent={false && //todo Fix for mobile view later
          <Button
            danger
            onClick={() => setShowArchiveGuildModal(true)}
          >Close Guild</Button>
        }
      />
      <ArchiveGuildModal
        open={showArchiveGuildModal}
        onSuccess={onArchiveGuild}
        guild={guild}
        onCancel={() => setShowArchiveGuildModal(false)}
      />
    </>
  )
}