import {Alert, Flex, Input, Modal, Typography} from "antd";
import {useEffect, useState} from "react";
import {useArchiveGuildMutation} from "../../../data/services/api/guild-api.ts";
import {Guild} from "../../../data/entities/guild.ts";
const {Text} = Typography;

export function ArchiveGuildModal({guild, open, onCancel, onSuccess}: {
  guild: Guild,
  open: boolean,
  onCancel: () => void,
  onSuccess: () => void
}) {
  const [enteredName, setEnteredName] = useState('');
  const [archiveGuild, {isLoading, isSuccess, isError, error}] = useArchiveGuildMutation();

  useEffect(() => {
    if (!isSuccess) return;
    onSuccess();
  }, [isSuccess]);

  if (!guild) return null;

  function onArchiveGuild() {
    archiveGuild(guild.id);
  }

  const guildNameValid = enteredName.toLowerCase() === guild.name.toLowerCase();

  return (
    <Modal
      title='Are you sure?'
      open={open}
      okText='Confirm'
      onOk={onArchiveGuild}
      okButtonProps={{danger: true, disabled: !guildNameValid}}
      onCancel={onCancel}
      confirmLoading={isLoading}
    >
      <Flex gap='1rem' vertical={true}>
        <div>
          <p>If you close this Guild, it will no longer show on your Guild's list.</p>
          <p>You will have 'some number of days' to undo this action.</p>
        </div>

        <Text strong>Enter your guild name below to confirm.</Text>
        <Input
          status={guildNameValid ? 'warning' : 'error'}
          value={enteredName}
          onChange={(e) => setEnteredName(e.target.value)}
          disabled={false}
          placeholder={guild.name}/>

        {isError &&
          <Alert
            type='error'
            description={error?.message}/>
        }
      </Flex>
    </Modal>
  )
}