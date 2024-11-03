import { usePage } from '../../core/ui/AppLayout.tsx';
import { useEffect } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { CreateEventModel, EventType } from '../../data/entities/event.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { GuildEventListNavigationState } from '../guilds/components/GuildEventsList.tsx';
import { DateTimePicker } from '../../core/forms/DateTimePicker.tsx';
import dayjs from 'dayjs';
import { LOCAL_DATE_FORMAT } from '../../data/helpers/constants';
import { useCreateBingoEventMutation } from '../../data/services/api/event-api.ts';

const { TextArea } = Input;

export function CreateEventPage() {
  const [createBingoEvent, {isLoading, isSuccess}] = useCreateBingoEventMutation();
  const {setHeaderContent} = usePage();
  const navigate = useNavigate();
  const {guildId} = useParams();
  const [form] = Form.useForm<CreateEventModel>();

  useEffect(() => {
    setHeaderContent({
      title: "Create Event",
      subtitle: undefined,
      backRoute: `/app/guilds/${guildId}`
    })
  }, []);

  useEffect(() => {
    if (!isSuccess) return;
    const locationState: GuildEventListNavigationState = {
      refetch: true
    }

    navigate(`/app/guilds/${guildId}`, {
      state: locationState
    });
  }, [isSuccess]);


  function handleOnFormFinish(val: CreateEventModel) {
    val.guildId = guildId;
    createEvent(val);
  }

  function createEvent<T extends CreateEventModel>(event: T) {
    switch (event.type) {
      case EventType.Bingo:
        createBingoEvent({
          ...event,
          columnCount: 3,
          rowCount: 3
        });
        break;
    }
  }

  const eventTypes = [
    { label: "Bingo", value: EventType.Bingo }
  ]
  const currentTime = dayjs().format(LOCAL_DATE_FORMAT);

  const initialValues: Partial<CreateEventModel> = {
    type: EventType.Bingo,
    startDate: dayjs().toISOString(),
    endDate: dayjs().add(7, 'days').toISOString()
  }

  return (
    <Form
      disabled={isLoading}
      form={form}
      layout="vertical"
      style={{ maxWidth: 768 }}
      onFinish={handleOnFormFinish}
      initialValues={initialValues}
    >
      <Form.Item label='Title' name='title' required>
        <Input />
      </Form.Item>
      <Form.Item label='Subtitle' name='subtitle'>
        <Input />
      </Form.Item>
      <Form.Item label='Description' name='description'>
        <TextArea />
      </Form.Item>
      <Form.Item label="Event Type" name='type'>
        <Select>
          {eventTypes.map((item) =>
            <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
          )}
        </Select>
      </Form.Item>

      <Form.Item label='Start Date' name='startDate'>
        <DateTimePicker min={currentTime} />
      </Form.Item>

      <Form.Item label='End Date' name='endDate'>
        <DateTimePicker min={currentTime} />
      </Form.Item>

      <Button htmlType="submit" type='primary'>Create Event</Button>
    </Form>
  )
}