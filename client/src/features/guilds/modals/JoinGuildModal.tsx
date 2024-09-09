import {Alert, Modal, Select} from 'antd';
import {useSearchGuildsQuery} from "../../../data/services/api/guild-api.ts";
import {useState} from "react";
import { Guild } from '../../../data/models/guild.ts';
import useDebounce from "../../../core/hooks/useDebounce.ts";

export function JoinGuildModal({open, onOkay, onCancel}) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data = [], isFetching } = useSearchGuildsQuery(debouncedSearchQuery, {
    skip: !debouncedSearchQuery || debouncedSearchQuery.length < 3 || !open
  });
  const [ selectedGuildId, setSelectedGuildId ] = useState<string | undefined>(undefined);

  function handleSearch(search: string) {
    setSearchQuery(search);
  }

  function handleOnCancel() {
    setSearchQuery("");
    setSelectedGuildId(undefined)
    onCancel();
  }

  return (
    <Modal
      title="Search for a guild"
      open={open}
      onOk={onOkay}
      okText='Apply to Guild'
      confirmLoading={isFetching}
      onCancel={handleOnCancel}
    >
      <Select
        className='min-w-52'
        showSearch
        value={selectedGuildId}
        placeholder='Guild Name'
        defaultActiveFirstOption={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={setSelectedGuildId}
        loading={isFetching}
        options={(data || []).map((guild: Guild) => ({
          value: guild.id,
          label: guild.name,
        }))}
      />
    </Modal>
  )
}