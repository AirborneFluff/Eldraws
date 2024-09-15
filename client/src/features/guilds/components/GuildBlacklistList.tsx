import {useParams} from "react-router-dom";
import {
  useGetGuildBlacklistedUsersQuery, useRemoveBlacklistedUserMutation
} from "../../../data/services/api/guild-api.ts";
import {Button, List} from "antd";
import {BlacklistedUser} from "../../../data/entities/blacklisted-user.ts";
import {CloseOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {ListView} from "../../../core/ui/ListView.tsx";
import {BlacklistUserModal} from "../modals/BlacklistUserModal.tsx";

export function GuildBlacklistList() {
  const {guildId} = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const {data, isFetching, refetch} = useGetGuildBlacklistedUsersQuery(guildId);
  const [removeUser, {
    isLoading: isRemoveLoading,
    isError: isRemoveError,
    isSuccess
  }] = useRemoveBlacklistedUserMutation();
  const blacklistedUsers = data as BlacklistedUser[];

  useEffect(() => {
    if (!isSuccess) return;
    refetch(guildId);
  }, [isSuccess]);

  function onUserRemove(item: BlacklistedUser) {
    removeUser(item);
  }

  function onUserAdd() {
    setModalVisible(false);
    refetch(guildId);
  }

  return (
    <ListView
      buttons={[
        <Button onClick={() => setModalVisible(true)}>Add User</Button>
      ]}>
      <List
        size='large'
        header={<span>Blacklist</span>}
        bordered
        dataSource={blacklistedUsers}
        renderItem={(item: BlacklistedUser) =>
          <ListItem
            isLoading={isRemoveLoading}
            item={item}
            onRemove={onUserRemove}
          />}
        loading={isFetching || isRemoveLoading}
      />

      <BlacklistUserModal
        open={modalVisible}
        onSuccess={onUserAdd}
        onCancel={() => setModalVisible(false)} />
    </ListView>
  )
}

function ListItem({item, isLoading, onRemove}: {
  item: BlacklistedUser,
  isLoading: boolean,
  onRemove: (item: BlacklistedUser) => void
}) {
  return (
    <List.Item className='!block'>
      <div className='flex justify-between items-center'>
        <p>{item.userName}</p>
        <Button
          disabled={isLoading}
          shape='circle'
          icon={<CloseOutlined/>}
          onClick={() => onRemove(item)}/>
      </div>
    </List.Item>
  )
}