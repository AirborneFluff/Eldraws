import { Tabs } from 'antd';
import { useEffect } from 'react';
import GuildsList from './components/GuildsList.tsx';
import { usePage } from '../../core/ui/AppLayout.tsx';
import { TabItem } from '../../data/types/tab-item.ts';
import { UserGuildApplicationsList } from './components/UserGuildApplicationsList.tsx';

export function GuildsPage() {
  const {setHeaderContent} = usePage();

  useEffect(() => {
    setHeaderContent({
      title: "Guilds",
      subtitle: undefined,
      backRoute: "/app"
    })
  }, []);

  const tabs: TabItem[] = [
    {
      key: 'guild',
      label: 'Guilds',
      children: <GuildsList />,
    },
    {
      key: 'applications',
      label: 'Applications',
      children: <UserGuildApplicationsList />
    },
  ]

  return (
    <Tabs
      destroyInactiveTabPane={true}
      defaultActiveKey="1"
      size='small'
      items={tabs}
    />
  )
}