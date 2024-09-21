import { Button } from 'antd';
import { JoinGuildModal } from './modals/JoinGuildModal.tsx';
import { CreateGuildModal } from './modals/CreateGuildModal.tsx';
import { useEffect, useState } from 'react';
import GuildsList from './components/GuildsList.tsx';
import { useGetUserGuildsQuery } from '../../data/services/api/guild-api.ts';
import { usePage } from '../../core/ui/AppLayout.tsx';
import {ListView} from "../../core/ui/ListView.tsx";

export function GuildsPage() {
  const [ showGuildSearchModal, setShowGuildSearchModal ] = useState(false);
  const [ showCreate, setShowCreate ] = useState(false);
  const {data: guilds, isLoading: guildsLoading, isError: guildsError, refetch} = useGetUserGuildsQuery();
  const {setHeaderContent} = usePage();

  useEffect(() => {
    setHeaderContent({
      title: "Guilds",
      subtitle: undefined,
      backRoute: "/app"
    })
  }, []);

  function onCreateGuildSuccess() {
    setShowCreate(false);
    refetch();
  }

  return (
    <ListView
      buttons={[
        <Button onClick={() => setShowCreate(true)}>Create Guild</Button>,
        <Button onClick={() => setShowGuildSearchModal(true)}>Find Guild</Button>
      ]}>
      <GuildsList guilds={guilds} isLoading={guildsLoading} isError={guildsError} />
      <JoinGuildModal
        open={showGuildSearchModal}
        onSuccess={() => setShowGuildSearchModal(false)}
        onCancel={() => setShowGuildSearchModal(false)} />
      <CreateGuildModal
        open={showCreate}
        onSuccess={onCreateGuildSuccess}
        onCancel={() => setShowCreate(false)} />
    </ListView>
  )
}