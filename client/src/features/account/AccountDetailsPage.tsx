import { Alert, Button, Form, Input } from 'antd';
import { useUpdateUserMutation } from '../../data/services/api/auth-api.ts';
import { UserUpdateModel } from '../../data/entities/user.ts';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../data/slices/userSlice.ts';
import { AppDispatch, RootState, store } from '../../data/store.ts';
import { useSelector } from 'react-redux';

export function AccountDetailsPage() {
  const [updateUser, {isLoading, isSuccess, isError, error}] = useUpdateUserMutation();
  const [form] = Form.useForm<UserUpdateModel>();
  const navigate = useNavigate();
  const {user} = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const setUser = async () => {
      const dispatch: AppDispatch = store.dispatch;
      await dispatch(loginUser());
      console.log("user set")
    }

    if (isSuccess) {
      setUser();
    }
  }, [isSuccess]);

  useEffect(() => {
    console.log(user);
    if (user?.gamertag) {
      navigate("/");
    }
  }, [user]);

  function handleOnFormFinish(values: UserUpdateModel) {
    updateUser(values);
  }

  return (
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

      <Button htmlType="submit" type='primary'>Update Account</Button>
    </Form>
  )
}