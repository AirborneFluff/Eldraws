import {usePage} from "../../core/ui/AppLayout.tsx";
import {useEffect} from "react";
import {useCreateEventMutation} from "../../data/services/api/event-api.ts";
import {Button, DatePicker, Divider, Form, Input, InputNumber, Select, Switch} from "antd";
import {EventType, Event} from "../../data/entities/event.ts";
import { useNavigate, useParams } from 'react-router-dom';
import { GuildEventListNavigationState } from '../guilds/components/GuildEventsList.tsx';
const { TextArea } = Input;

export function CreateEventPage() {
  const [createEvent, {data, isLoading, isError, isSuccess, error}] = useCreateEventMutation();
  const {setHeaderContent} = usePage();
  const navigate = useNavigate();
  const {guildId} = useParams();
  const [form] = Form.useForm();

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


  function handleOnFormFinish(val: Event) {
    val.guildId = guildId;
    createEvent(val);
  }

  const eventTypes = [
    { label: "Tile Race", value: EventType.TileRace },
    { label: "Bingo", value: EventType.Bingo },
  ]

  return (
    <Form
      disabled={isLoading}
      form={form}
      layout="vertical"
      style={{ maxWidth: 768 }}
      onFinish={handleOnFormFinish}
    >
      <Form.Item label='Title' name='title'>
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
        <DatePicker format='dd/MM/yyyy' showTime />
      </Form.Item>

      <Form.Item label='End Date' name='endDate'>
        <DatePicker showTime />
      </Form.Item>

      <Divider/>

      <Form.Item label="Entry Requires Approval" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label='Entry Open Date' name='entryOpenDate'>
        <DatePicker showTime />
      </Form.Item>

      <Form.Item label='Entry Close Date' name='entryCloseDate'>
        <DatePicker showTime />
      </Form.Item>

      <Form.Item label="InputNumber">
        <InputNumber />
      </Form.Item>
      <Form.Item label="Button">
        <Button htmlType="submit" type='primary'>Button</Button>
      </Form.Item>
    </Form>
  )
}