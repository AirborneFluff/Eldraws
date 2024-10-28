import {useParams} from "react-router-dom";
import {
  useGetGuildBlacklistedUsersQuery, useRemoveBlacklistedUserMutation
} from "../../../data/services/api/guild-api.ts";
import { Alert, Button, List } from 'antd';
import {BlacklistedUser} from "../../../data/entities/blacklisted-user.ts";
import {CloseOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {PageView} from "../../../core/ui/PageView.tsx";
import {BlacklistUserModal} from "../modals/BlacklistUserModal.tsx";

export function GuildBlacklistList() {
  const {guildId} = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const {data: blacklistedUsers, isFetching, refetch, isError} = useGetGuildBlacklistedUsersQuery(guildId);
  const [removeUser, {isLoading: isRemoveLoading, isSuccess}] = useRemoveBlacklistedUserMutation();

  useEffect(() => {
    if (!isSuccess) return;
    refetch();
  }, [isSuccess]);

  function onUserRemove(item: BlacklistedUser) {
    removeUser(item);
  }

  function onUserAdd() {
    setModalVisible(false);
    refetch();
  }

  return (
    <PageView
      buttons={[
        <Button onClick={() => setModalVisible(true)}>Add User</Button>,
        <Button disabled={isFetching} onClick={refetch}>Refresh</Button>
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
        footer={isError && <Alert
          description='There was a problem contacting the server'
          type='error'
        />}
      />

      <BlacklistUserModal
        open={modalVisible}
        onSuccess={onUserAdd}
        onCancel={() => setModalVisible(false)} />
    </PageView>
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