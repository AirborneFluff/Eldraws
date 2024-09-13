import {Alert, Button, Descriptions, Modal, Space} from "antd";
import {GuildMember} from "../../../data/entities/guild-member.ts";
import {MemberAction} from "../../../data/types/member-action.ts";
import {useMemberActionMutation} from "../../../data/services/api/guild-api.ts";
import {useEffect} from "react";

export function GuildMemberDetailsModal({onSuccess, onDismiss, member}: {
  onSuccess: () => void,
  onDismiss: () => void
  member: GuildMember
}) {
  const open = member != null;
  const [performAction, {isLoading, isError, error, isSuccess}] = useMemberActionMutation();
  const isOwner = member?.roleName === 'Owner';

  //todo Implement error handling and action complete close modal

  useEffect(() => {
    if (!isSuccess) return;
    onSuccess();
  }, [isSuccess]);

  function handleAction(action: MemberAction) {
    performAction({
      guildId: member.guildId,
      appUserId: member.appUserId,
      action: action
    })
  }

  return (
    <Modal
      title="Manage Member"
      open={open}
      onCancel={onDismiss}
      confirmLoading={false}
      footer={[
        <Button key="back" onClick={onDismiss}>Close</Button>
      ]}
    >
      {member &&
        <Descriptions layout='horizontal' bordered column={1}>
          <Descriptions.Item label='Username'>{member.userName}</Descriptions.Item>
          <Descriptions.Item label='Email'>{member.email}</Descriptions.Item>
        </Descriptions>
      }
      <Space className='mt-4'>
        <Button
          disabled={isLoading || isOwner}
          onClick={() => handleAction('remove')}>Remove</Button>
        <Button
          disabled={isLoading || isOwner}
          danger
          onClick={() => handleAction('blacklist')}>Blacklist</Button>
      </Space>

      {isError &&
        <Alert
          className='my-4'
          type='error'
          description={error?.message}/>
      }
    </Modal>
  )
}