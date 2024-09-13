import {Button, Descriptions, Modal, Space} from "antd";
import {GuildMember} from "../../../data/entities/guild-member.ts";
import {MemberAction} from "../../../data/types/member-action.ts";
import {useMemberActionMutation} from "../../../data/services/api/guild-api.ts";

export function GuildMemberDetailsModal({onCancel, member}: {member: GuildMember}) {
  const open = member != null;
  const [performAction, {isLoading, isError, error, isSuccess}] = useMemberActionMutation();

  //todo Implement error handling and action complete close modal

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
      okText='Finish'
      onOk={onCancel}
      onCancel={onCancel}
      confirmLoading={false}
    >
      {member &&
        <Descriptions layout='horizontal' bordered column={1}>
          <Descriptions.Item label='Username'>{member.userName}</Descriptions.Item>
          <Descriptions.Item label='Email'>{member.email}</Descriptions.Item>
        </Descriptions>
      }
      <Space className='mt-4'>
        <Button
          disabled={isLoading}
          onClick={() => handleAction('remove')}>Remove</Button>
        <Button
          disabled={isLoading}
          danger
          onClick={() => handleAction('blacklist')}>Blacklist</Button>
      </Space>
    </Modal>
  )
}