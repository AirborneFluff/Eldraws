import {
  useGetGuildMembersQuery
} from "../../../data/services/api/guild-api.ts";
import {Button, Descriptions, List} from "antd";
import {GuildMember} from "../../../data/entities/guild-member.ts";
import {GuildMemberDetailsModal} from "../modals/GuildMemberDetailsModal.tsx";
import {useState} from "react";
import {PageView} from "../../../core/ui/PageView.tsx";
import {useGuildDetails} from "../GuildDetailsPage.tsx";

export function GuildMembersList() {
  const {guild, userRole} = useGuildDetails();
  const {data: members, isFetching, refetch} = useGetGuildMembersQuery(guild?.id);
  const [selectedMember, setSelectedMember] = useState<GuildMember>(null);

  function handleOnClick(item: GuildMember) {
    if (userRole !== 'Owner' || userRole !== 'Owner') return;
    setSelectedMember(item);
  }

  function handleMemberUpdate() {
    setSelectedMember(null);
    refetch();
  }

  const headerButtons = [
    <Button disabled={isFetching} onClick={refetch}>Refresh</Button>
  ];

  return (
    <PageView buttons={headerButtons}>
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
        loading={isFetching}
      />
      <GuildMemberDetailsModal
        member={selectedMember}
        onDismiss={handleMemberUpdate} />
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