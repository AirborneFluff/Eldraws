import { Col, Row, Statistic } from 'antd';
import { useRaffleDetails } from '../providers/raffle-details-provider.tsx';
import { formatNumber } from '../../../core/utils/text-utilities.ts';

export function RaffleEntryStatistics() {
  const {raffleDetails} = useRaffleDetails();

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Statistic title="Donations" value={formatNumber(raffleDetails?.totalDonations)} />
      </Col>
      <Col span={12}>
        <Statistic title="Tickets" value={raffleDetails?.totalTickets} />
      </Col>
    </Row>
  )
}