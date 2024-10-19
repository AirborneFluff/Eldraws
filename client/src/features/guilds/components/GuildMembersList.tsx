import {useParams} from "react-router-dom";
import {
  useGetGuildMembersQuery
} from "../../../data/services/api/guild-api.ts";
import {Descriptions, List} from "antd";
import {GuildMember} from "../../../data/entities/guild-member.ts";
import {GuildMemberDetailsModal} from "../modals/GuildMemberDetailsModal.tsx";
import {useState} from "react";
import {PageView} from "../../../core/ui/PageView.tsx";

export function GuildMembersList() {
  const {guildId} = useParams();
  const {data: members, isLoading, refetch} = useGetGuildMembersQuery(guildId);
  const [selectedMember, setSelectedMember] = useState<GuildMember>(null);

  function handleOnClick(item: GuildMember) {
    setSelectedMember(item);
  }

  function handleMemberUpdate() {
    setSelectedMember(null);
    refetch();
  }

  return (
    <PageView>
      <List
        size='large'
        header={<span>Members</span>}
        bordered
        dataSource={members}
        renderItem={(item: GuildMember) =>
          <ListItem
            item={item}
            onClick={handleOnClick}
          />}
        loading={isLoading}
      />
      <GuildMemberDetailsModal
        member={selectedMember}
        onSuccess={handleMemberUpdate}
        onDismiss={() => setSelectedMember(null)} />
    </PageView>
  )
}

interface ListItemProps {
  item: GuildMember,
  onClick: (item: GuildMember) => void
}

function ListItem({item, onClick}: ListItemProps) {
  return (
    <List.Item className='hover:bg-gray-200 cursor-pointer !block' onClick={() => onClick(item)}>
      <Descriptions layout='vertical' size='small'>
        <Descriptions.Item label='Username'>{item.userName}</Descriptions.Item>
        <Descriptions.Item label='Gamertag'>{item.gamertag}</Descriptions.Item>
      </Descriptions>
    </List.Item>
  )
}