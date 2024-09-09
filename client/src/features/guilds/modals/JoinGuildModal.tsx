import { AutoComplete, Modal, Input } from 'antd';
import {useSearchGuildsQuery} from "../../../data/services/api/guild-api.ts";
import {useState} from "react";
import { Guild } from '../../../data/models/guild.ts';
import debounce from 'lodash/debounce';

export function JoinGuildModal({open, onOkay, onCancel}) {
  const [ searchTerm, setSearchTerm ] = useState("");
  const { data, isLoading, isError, error } = useSearchGuildsQuery(searchTerm);

  function handleSearch(search: string) {
    setSearchTerm(search);
  }

  const options = data?.map((guild: Guild) => ({
    label: guild.name,
    value: guild.id
  }))

  return (
    <Modal
      title="Title"
      open={open}
      onOk={onOkay}
      confirmLoading={isLoading}
      onCancel={onCancel}
    >
      <AutoComplete
        popupMatchSelectWidth={252}
        style={{ width: 300 }}
        options={options}
        /*onSelect={onSelect}*/
        onSearch={debounce(handleSearch, 300)}
        disabled={isLoading}
        size="large"
      >
        <Input.Search size="large" placeholder="input here" enterButton />
      </AutoComplete>
    </Modal>
  )
}