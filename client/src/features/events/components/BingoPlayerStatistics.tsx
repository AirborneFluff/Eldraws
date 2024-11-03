import { Button, Table } from 'antd';
import { useGetBingoBoardTilesQuery } from '../../../data/services/api/bingo-event-api.ts';
import { useEventDetails } from '../EventDetailsPage.tsx';
import { analyzeUserBingoTiles } from '../helpers/bingo-analysis.ts';

export function BingoPlayerStatistics() {
  const {event} = useEventDetails();
  const {data, refetch, isFetching} = useGetBingoBoardTilesQuery(event.id);

  const columns = [
    {
      title: 'Gamertag',
      dataIndex: 'gamertag',
      key: 'gamertag',
    },
    {
      title: 'Lines',
      dataIndex: 'lines',
      key: 'lines',
    },
    {
      title: 'Tiles Completed',
      dataIndex: 'completedCount',
      key: 'completedCount',
    }
  ];

  return (
    <>
      <Button onClick={() => refetch()}>Refresh</Button>
      <div className="border border-[#f0f0f0] rounded-lg">
        <Table
          rowKey={(record) => record.appUserId}
          loading={isFetching}
          pagination={false}
          dataSource={analyzeUserBingoTiles(data)}
          columns={columns}/>
      </div>
    </>
  )
}