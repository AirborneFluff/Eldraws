import { Table, TableColumnsType } from 'antd';
import { useLazyGetRaffleEntriesQuery } from '../../../data/services/api/raffle-event-api.ts';
import { useEventDetails } from '../../events/EventDetailsPage.tsx';
import React, { useEffect } from 'react';
import { formatNumber } from '../../../core/utils/text-utilities.ts';

interface DataType {
  key: React.Key;
  gamertag: string;
  donation: string;
  tickets: string;
}

interface RaffleEntriesListProps {
  reload: boolean;
}

export function RaffleEntriesList({reload}: RaffleEntriesListProps) {
  const {event} = useEventDetails();
  const [getEntries, {data: response, isFetching}] = useLazyGetRaffleEntriesQuery();

  useEffect(() => {
    getEntries({
      pageNumber: 0,
      pageSize: 10,
      eventId: event.id
    })
  }, [reload]);

  const handlePageChange = (pageNumber: number, pageSize: number) => {
    if (!event?.id) return;
    getEntries({
      pageNumber,
      pageSize,
      eventId: event?.id,
    });
  }

  const dataSource: DataType[] = (response?.items ?? []).map(item => ({
    key: item.id,
    gamertag: item.participant.gamertag,
    donation: formatNumber(item.donation),
    tickets: `${item.lowTicket} - ${item.highTicket}`
  }))

  const columns: TableColumnsType<DataType> = [
    { title: 'Gamertag', dataIndex: 'gamertag' },
    { title: 'Donation', dataIndex: 'donation' },
    { title: 'Tickets', dataIndex: 'tickets' }
  ];

  return (
    <Table<DataType>
      size='large'
      columns={columns}
      dataSource={dataSource}
      loading={isFetching}
      pagination={{
        total: response?.pagination?.totalCount ?? 0,
        onChange: handlePageChange
      }}
    />
  )
}