import {useParams} from "react-router-dom";
import {
  useGetGuildBlacklistedUsersQuery
} from "../../../data/services/api/guild-api.ts";
import {Button, List, Space} from "antd";
import {BlacklistedUser} from "../../../data/entities/blacklisted-user.ts";
import {CloseOutlined} from "@ant-design/icons";

export function GuildBlacklistList() {
  const { guildId } = useParams();
  const {data, isLoading, refetch} = useGetGuildBlacklistedUsersQuery(guildId);
  const blacklistedUsers = data as BlacklistedUser[];

  return (
    <List
      size='large'
      header={<span>Blacklist</span>}
      bordered
      dataSource={blacklistedUsers}
      renderItem={(item: BlacklistedUser) =>
        <ListItem
          isLoading={isLoading}
          item={item}
          onRemove={(item) => console.log(item)}
        />}
      loading={isLoading}
    />
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
        <p>{item.email}</p>
        <Button
          disabled={isLoading}
          shape='circle'
          icon={<CloseOutlined />}
          onClick={() => onRemove (item)} />
      </div>
    </List.Item>
  )
}