import {
  useBlacklistUserMutation
} from "../../../data/services/api/guild-api.ts";
import {Alert, Form, Input, Modal} from "antd";
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import { BlacklistedUser } from '../../../data/entities/blacklisted-user.ts';

export function BlacklistUserModal({open, onSuccess, onCancel}) {
  const [blacklistUser, {isLoading, isError, error, isSuccess}] = useBlacklistUserMutation();
  const {guildId} = useParams();
  const [form] = Form.useForm<Partial<BlacklistedUser>>();

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess]);

  function handleFormSubmit({userName}: Partial<BlacklistedUser>) {
    blacklistUser({
      guildId: guildId,
      userName: userName
    });
  }

  return (
    <Modal
      title="Blacklist an User"
      open={open}
      okText='Add'
      onOk={() => form.submit()}
      onCancel={onCancel}
      confirmLoading={isLoading}
    >
      <Form
        form={form}
        disabled={isLoading}
        name="basic"
        style={{maxWidth: 600}}
        onFinish={handleFormSubmit}
        autoComplete="off"
      >

        <Form.Item<string>
          label="Username"
          name="userName"
          rules={[{required: true, message: 'Please an Username to blacklist!'}]}
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