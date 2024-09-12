import { useParams } from 'react-router-dom';
import { Guild } from '../../data/models/guild.ts';
import { useGetGuildQuery } from '../../data/services/api/guild-api.ts';
import { useEffect } from 'react';
import { usePage } from '../../core/ui/AppLayout.tsx';
import { Tabs } from 'antd';
import { TabItem } from '../../data/types/tab-item.ts';
import { GuildApplicationsList } from './components/GuildApplicationsList.tsx';

export function ManageGuildPage() {
  const { guildId } = useParams();
  const {setLoading, setHeaderContent} = usePage();
  const {data, isLoading: guildLoading, isError: guildError, refetch} = useGetGuildQuery<Guild>(guildId);
  const guild = data as Guild;

  useEffect(() => {
    if (!guild) return;
    
    setHeaderContent({
      title: "Manage Guild",
      subtitle: guild.name
    })
  }, [guild]);

  useEffect(() => {
    setLoading(guildLoading);
  }, [guildLoading]);

  const tabs: TabItem[] = [
    {
      key: 'applications',
      label: 'Applications',
      children: <GuildApplicationsList guildId={guild?.id} />
    }
  ]

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        size='large'
        items={tabs}
      />
    </>
  )
}