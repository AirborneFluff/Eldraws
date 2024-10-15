import {Alert, Button, Form, Input, Layout} from 'antd';
import {useUpdateUserMutation} from '../../data/services/api/auth-api.ts';
import { UserUpdateModel } from '../../data/entities/user.ts';
import { useEffect } from 'react';

export function AccountDetailsPage() {
  const [updateUser, {isLoading, isSuccess, isError, error}] = useUpdateUserMutation();
  const [form] = Form.useForm<UserUpdateModel>();

  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);

  function handleOnFormFinish(values: UserUpdateModel) {
    updateUser(values);
  }

  return (
    <Layout className='max-w-lg mx-auto p-8 mt-8 sm:mt-16 lg:mt-32 rounded'>
      <p className='text-gray-800 text-lg mb-12'>We just need to finish setting up your account</p>
      <Form
      disabled={isLoading}
      form={form}
      layout="vertical"
      style={{ maxWidth: 768 }}
      onFinish={handleOnFormFinish}
      >
        <Form.Item
          label='Gamertag'
          name='gamertag'
          rules={[{required: true, message: 'You need a Gamertag'}]}
        >
          <Input />
        </Form.Item>

        {isError &&
          <Alert
            className='my-4'
            type='error'
            description={error?.message}/>
        }

        <Button htmlType="submit" type='primary'>Confirm</Button>
      </Form>
    </Layout>
  )
}