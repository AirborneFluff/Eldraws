import { Alert, Form, Input, Modal } from 'antd';
import { useCreateGuildMutation } from '../../../data/services/api/guild-api.ts';
import { useEffect } from 'react';

export function CreateGuildModal({open, onSuccess, onCancel}) {
  const [createGuild, {isLoading, isError, error, isSuccess}] = useCreateGuildMutation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess]);

  return (
    <Modal
      title="Create a Guild"
      open={open}
      okText='Create'
      onOk={() => form.submit()}
      onCancel={onCancel}
      confirmLoading={isLoading}
    >
      <Form
        form={form}
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
            className='my-4'
            type='error'
            description={error?.message}/>
        }
      </Form>
    </Modal>
  )
}