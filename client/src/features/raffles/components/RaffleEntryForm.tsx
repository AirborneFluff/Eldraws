import { Button, Divider, Flex, Form, Input, Select, Space, Switch, Typography } from 'antd';
import { useAddRaffleEntryMutation } from '../../../data/services/api/raffle-event-api.ts';
import { NewRaffleEntry } from '../../../data/entities/raffle-entry.ts';
import {
  useAddEventParticipantMutation,
  useSearchEventParticipantsQuery
} from '../../../data/services/api/guild-api.ts';
import { useEffect, useState } from 'react';
import { useEventDetails } from '../../events/EventDetailsPage.tsx';
import useDebounce from '../../../core/hooks/useDebounce.ts';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useRaffleDetails } from '../providers/raffle-details-provider.tsx';
import { minValidator } from '../../../core/forms/validators/min-validator.ts';
const { Text } = Typography;

interface RaffleEntryFormProps {
  onEntryAdded: () => void;
}

export function RaffleEntryForm({onEntryAdded}: RaffleEntryFormProps) {
  const [searchQuery, setSearchQuery] = useState<{guildId: string, searchTerm: string}>();
  const [participantsOptions, setParticipantsOptions] = useState<any[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [newParticipantGamertag, setNewParticipantGamertag] = useState<string>();

  const {event} = useEventDetails();
  const {raffleDetails} = useRaffleDetails();
  const [addEntry, {isLoading, isSuccess}] = useAddRaffleEntryMutation();
  const [addParticipant, {isLoading: addParticipantLoading, data: newParticipant}] = useAddEventParticipantMutation();
  const {data: participants, isFetching: participantsLoading} = useSearchEventParticipantsQuery(debouncedSearchQuery, {
    skip: !debouncedSearchQuery?.searchTerm || debouncedSearchQuery?.searchTerm.length < 3 || !open
  });

  const [form] = Form.useForm<NewRaffleEntry>();

  useEffect(() => {
    if (isSuccess) {
      onEntryAdded();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!participantsLoading) {
      setParticipantsOptions(participants || []);
    }
  }, [participants, participantsLoading]);

  useEffect(() => {
    if (newParticipant) {
      setParticipantsOptions(prev => [newParticipant, ...prev]);
    }
  }, [newParticipant]);

  const handleOnFinish = (values: NewRaffleEntry) => {
    addEntry({
      eventId: event.id,
      ...values
    });
  }

  const handleAddParticipant = () => {
    addParticipant({
      guildId: event.guildId,
      gamertag: newParticipantGamertag
    });
  }

  function handleSearch(search: string) {
    setNewParticipantGamertag(search);
    setSearchQuery({
      guildId: event.guildId,
      searchTerm: search
    });
  }

  return (
    <Form
      className="mt-8"
      form={form}
      disabled={isLoading}
      onFinish={handleOnFinish}
      autoComplete="off"
    >
      <Form.Item
        label='Gamertag'
        name='participantId'
        rules={[{ required: true }]}>
        <Select
          className='min-w-52'
          searchValue={newParticipantGamertag}
          showSearch
          placeholder='Gamertag'
          defaultActiveFirstOption={false}
          filterOption={false}
          onSearch={handleSearch}
          loading={participantsLoading}
          options={participantsOptions.map((p) => ({
            value: p.id,
            label: p.gamertag,
          }))}
          dropdownRender={(menu) => (
            <>
              {menu}
              {newParticipantGamertag && (
                <>
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 4px' }}>
                    <Button
                      loading={addParticipantLoading}
                      type="text"
                      icon={<PlusCircleOutlined />}
                      onClick={handleAddParticipant}>
                      <Text type="secondary">{newParticipantGamertag}</Text>
                    </Button>
                  </Space>
                </>
              )}
            </>
          )}
        />
      </Form.Item>
      <Form.Item
        label='Donation'
        name='donation'
        rules={[
          { required: true, message: 'You must select a participant' },
          { validator: minValidator(raffleDetails.entryCost, `Minimum entry is ${raffleDetails.entryCost}`) },
        ]}>
        <Input type='number' />
      </Form.Item>
      <Flex justify='space-between'>
        <Form.Item label='Complimentary' name='complimentary'>
          <Switch />
        </Form.Item>
        <Button htmlType="submit" type='primary'>Add</Button>
      </Flex>
    </Form>
  )
}