import { usePage } from '../../core/ui/AppLayout.tsx';
import { useEffect } from 'react';
import { Button, Form, FormInstance, Input, Select } from 'antd';
import { CreateEventModel, EventType } from '../../data/entities/event.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { GuildEventListNavigationState } from '../guilds/components/GuildEventsList.tsx';
import { DateTimePicker } from '../../core/forms/DateTimePicker.tsx';
import dayjs from 'dayjs';
import { LOCAL_DATE_FORMAT } from '../../data/helpers/constants';
import { useCreateBingoEventMutation } from '../../data/services/api/event-api.ts';
import { BingoEventExtras } from '../../data/entities/bingo-event.ts';

const { TextArea } = Input;

export function CreateEventPage() {
  const [createBingoEvent, {isLoading, isSuccess}] = useCreateBingoEventMutation();
  const {setHeaderContent} = usePage();
  const navigate = useNavigate();
  const {guildId} = useParams();
  const [form] = Form.useForm<CreateEventModel>();
  const [bingoExtrasForm] = Form.useForm<BingoEventExtras>();

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
        const extras = bingoExtrasForm.getFieldsValue();
        createBingoEvent({
          ...event,
          ...extras
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

      {renderBingoExtras(bingoExtrasForm)}

      <Button htmlType="submit" type='primary'>Create Event</Button>
    </Form>
  )
}

const renderBingoExtras = (form: FormInstance<BingoEventExtras>) => {
  const gridOptions = [
    {columns: 5, rows: 5, value: 0},
    {columns: 4, rows: 4, value: 1},
    {columns: 3, rows: 3, value: 2},
  ]

  const setFormValues = (optionValue: any) => {
    const selectedOption = gridOptions.find(option => option.value === optionValue);
    if (selectedOption) {
      form.setFieldsValue({ columnCount: selectedOption.columns, rowCount: selectedOption.rows });
    }
  };

  return (
    <Form form={form} layout="vertical" initialValues={{ columnCount: 5, rowCount: 5 }}>
      <Form.Item label='Grid Size'>
        <Select onSelect={setFormValues} defaultValue={gridOptions[0]}>
          {gridOptions.map((item) =>
            <Select.Option key={`${item.columns}-${item.rows}`} value={item.value}>{item.columns}x{item.rows}</Select.Option>
          )}
        </Select>
      </Form.Item>
      <Form.Item name="columnCount" hidden>
        <input type="hidden"/>
      </Form.Item>
      <Form.Item name="rowCount" hidden>
        <input type="hidden"/>
      </Form.Item>
    </Form>
  )
}