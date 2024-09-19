import {usePage} from "../../core/ui/AppLayout.tsx";
import {useEffect} from "react";
import {useCreateEventMutation} from "../../data/services/api/event-api.ts";
import {Button, DatePicker, Divider, Form, Input, InputNumber, Select, Switch} from "antd";
import {EventType, Event} from "../../data/entities/event.ts";
import {useParams} from "react-router-dom";
const { TextArea } = Input;

export function CreateEventPage() {
  const [createEvent, {data, isLoading, isError, isSuccess, error}] = useCreateEventMutation();
  const {setHeaderContent} = usePage();
  const {guildId} = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    setHeaderContent({
      title: "Create Event",
      subtitle: undefined
    })
  }, []);

  useEffect(() => {
    if (!isSuccess) return;
    window.history.back();
  }, [isSuccess]);


  function handleOnFormFinish(val: Event) {
    val.guildId = guildId;
    createEvent(val);
  }

  const eventTypes = [
    { label: "Solo Bingo", value: EventType.SoloBingo },
    { label: "Group Bingo", value: EventType.GroupBingo }
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