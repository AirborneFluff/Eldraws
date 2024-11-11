import { Tabs } from 'antd';
import { PageView } from '../../core/ui/PageView.tsx';

import { useEventDetails } from '../events/EventDetailsPage.tsx';
import {GetTabItems, TabItemExtended} from "../../data/models/tab-item-extended.ts";
import { RaffleDetailsProvider } from './providers/raffle-details-provider.tsx';
import { useGetRaffleEventDetailsQuery } from '../../data/services/api/raffle-event-api.ts';
import { RaffleEntriesTab } from './components/RaffleEntriesTab.tsx';

export function RaffleEventDetailsPage() {
  const {event} = useEventDetails();
  const {data: raffleDetails, isFetching: fetchingRaffleDetails, refetch: refetchRaffleDetails} = useGetRaffleEventDetailsQuery(event.id);

  const tabs: TabItemExtended[] = [
    {
      key: 'entries',
      label: 'Entries',
      children: (
        <RaffleEntriesTab />
      )
    }
  ];

  return (
    <RaffleDetailsProvider raffleDetails={raffleDetails} refetch={refetchRaffleDetails}>
      <PageView loading={!event || fetchingRaffleDetails}>
        <Tabs
          destroyInactiveTabPane={true}
          defaultActiveKey="1"
          size='small'
          items={GetTabItems(tabs)}
        />
      </PageView>
    </RaffleDetailsProvider>
  )
}