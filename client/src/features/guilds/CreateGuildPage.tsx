import {Alert, Button, Form, Input, Typography} from "antd";
import {useCreateGuildMutation} from "../../data/services/api/guild-api.ts";
import {useNavigate} from "react-router-dom";
import { useEffect } from 'react';

const {Title} = Typography;

export function CreateGuildPage() {
  const [createGuild, {isLoading, isError, error, isSuccess}] = useCreateGuildMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/app");
    }
  }, [isSuccess, navigate]);

  return (
    <>
      <Title level={2}>Create a Guild</Title>
      <Form
        disabled={isLoading}
        name="basic"
        style={{maxWidth: 600}}
        initialValues={{remember: true}}
        onFinish={createGuild}
        autoComplete="off"
      >

        <Form.Item<string>
          label="Guild Name"
          name="name"
          rules={[{required: true, message: 'Please input your Guild Name!'}]}
        >
          <Input/>
        </Form.Item>

        {isError &&
          <Alert
            className='mb-6'
            type='error'
            description={error?.message}/>
        }

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}