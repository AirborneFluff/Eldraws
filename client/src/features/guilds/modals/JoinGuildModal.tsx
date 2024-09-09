import {Modal} from "antd";
import {useSearchGuildsQuery} from "../../../data/services/api/guild-api.ts";
import {useState} from "react";

export function JoinGuildModal({open, onOkay}) {
  const [ searchTerm, setSearchTerm ] = useState("");
  const { data, isLoading, isError, error } = useSearchGuildsQuery(searchTerm);

  return (
    <Modal
      title="Title"
      open={open}
      onOk={onOkay}
      confirmLoading={isLoading}
    >
      <input value={searchTerm} onChange={(val) => setSearchTerm(val.target.value)}/>
    </Modal>
  )
}