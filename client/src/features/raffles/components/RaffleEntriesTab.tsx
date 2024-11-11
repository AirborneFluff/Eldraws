import { RaffleEntryForm } from './RaffleEntryForm.tsx';
import { RaffleEntriesList } from './RaffleEntriesList.tsx';
import { useState } from 'react';

export function RaffleEntriesTab() {
  const [reloadListTrigger, setReloadListTrigger] = useState<boolean>(false);
  const reloadList = () => setReloadListTrigger(prev => !prev);

  return (
    <>
      <RaffleEntryForm onEntryAdded={reloadList} />
      <RaffleEntriesList reload={reloadListTrigger} />
    </>
  )
}