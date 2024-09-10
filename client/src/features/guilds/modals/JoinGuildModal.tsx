import { Alert, Button, Modal, Select } from 'antd';
import {
  useApplyToGuildMutation,
  useSearchGuildsQuery
} from '../../../data/services/api/guild-api.ts';
import { useEffect, useState } from 'react';
import { Guild } from '../../../data/models/guild.ts';
import useDebounce from "../../../core/hooks/useDebounce.ts";

export function JoinGuildModal({open, onSuccess, onCancel}) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const [applyToGuild, {isLoading, isError: isApplicationError, error: applicationError, isSuccess}] = useApplyToGuildMutation();
  const { data = [], isFetching } = useSearchGuildsQuery(debouncedSearchQuery, {
    skip: !debouncedSearchQuery || debouncedSearchQuery.length < 3 || !open
  });

  const [ selectedGuildId, setSelectedGuildId ] = useState<string | undefined>(undefined);

  function handleSearch(search: string) {
    setSearchQuery(search);
  }

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess]);

  const footer = [
    <Button key="back" onClick={onCancel}>Cancel</Button>,
    <Button
      key="submit"
      type="primary"
      loading={isLoading}
      onClick={() => applyToGuild(selectedGuildId)}
      disabled={!selectedGuildId}>Apply to Guild
    </Button>
  ]

  return (
    <Modal
      title="Search for a guild"
      open={open}
      onOk={() => applyToGuild(selectedGuildId)}
      okText='Apply to Guild'
      confirmLoading={isLoading}
      onCancel={onCancel}
      footer={footer}
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

      {isApplicationError &&
        <Alert
          className='mt-3'
          type='error'
          description={applicationError?.message}
        />
      }
    </Modal>
  )
}