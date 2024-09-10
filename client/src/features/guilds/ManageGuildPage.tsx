import { useParams } from 'react-router-dom';
import { Guild } from '../../data/models/guild.ts';
import { useGetGuildQuery } from '../../data/services/api/guild-api.ts';
import { useEffect } from 'react';
import { usePage } from '../../core/ui/AppLayout.tsx';

export function ManageGuildPage() {
  const { guildId } = useParams();
  const {setLoading, setHeaderContent} = usePage();
  const {data, isLoading: guildLoading, isError: guildError, refetch} = useGetGuildQuery<Guild>(guildId);
  const guild = data as Guild;

  useEffect(() => {
    setHeaderContent({
      title: "Manage Guild",
      subtitle: guild?.name
    })
  }, [guild]);

  useEffect(() => {
    setLoading(guildLoading);
  }, [guildLoading]);

  return (
    <>
      {guildId}
    </>
  )
}