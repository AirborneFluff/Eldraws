import {Alert, Button, Descriptions, Modal, Select, Space} from "antd";
import {GuildMember} from "../../../data/entities/guild-member.ts";
import {MemberAction} from "../../../data/types/member-action.ts";
import {useMemberActionMutation, useUpdateGuildMemberRoleMutation} from "../../../data/services/api/guild-api.ts";
import {useEffect, useState} from "react";
import {GuildRoleName} from "../../../data/entities/guild-role.ts";

export function GuildMemberDetailsModal({onDismiss, member}: {
  onSuccess: () => void,
  onDismiss: () => void
  member: GuildMember
}) {
  const open = member != null;
  const [performAction, {isLoading, isError: isActionError, error: actionError}] = useMemberActionMutation();
  const [updateRole, {
    data: updatedRole,
    isSuccess: roleUpdateSuccess,
    isLoading: roleUpdateLoading,
    isError: isRoleUpdateError,
    error: roleUpdateError
  }] = useUpdateGuildMemberRoleMutation();
  const isOwner = member?.roleName === 'Owner';
  const isError = isActionError || isRoleUpdateError;
  const error = actionError ?? roleUpdateError;
  const [memberMutation, setMemberMutation] = useState<GuildMember>(member);

  useEffect(() => {
    if (roleUpdateSuccess) {
      setMemberMutation(curr => ({
        ...curr,
        roleName: updatedRole?.name,
        roleId: updatedRole?.id
      }));
    }
  }, [roleUpdateSuccess]);

  useEffect(() => {
    setMemberMutation(member);
  }, [member]);

  function handleAction(action: MemberAction) {
    performAction({
      guildId: member.guildId,
      appUserId: member.appUserId,
      action: action
    })
  }

  function handleRoleChange(role: GuildRoleName) {
    updateRole({roleName: role, guildId: member.guildId, appUserId: member.appUserId});
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
      {memberMutation &&
        <>
          <Descriptions layout='horizontal' bordered column={1}>
            <Descriptions.Item label='Username'>{memberMutation.userName}</Descriptions.Item>
            <Descriptions.Item label='Gamertag'>{memberMutation.gamertag}</Descriptions.Item>
          </Descriptions>

          <div className='w-full mt-4'>
            <Select className='w-full' disabled={isOwner || roleUpdateLoading} value={memberMutation.roleName} onChange={handleRoleChange}>
              <Select.Option disabled key='Owner' value={'Owner'}>Owner</Select.Option>

              {['Admin', 'Moderator', 'Member'].map((item) =>
                <Select.Option key={item} value={item}>{item}</Select.Option>
              )}
            </Select>
          </div>
        </>
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

      {
        isError &&
        <Alert
          className='my-4'
          type='error'
          description={error?.message}/>
      }
    </Modal>
  )
}