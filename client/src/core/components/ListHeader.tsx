import { Button } from 'antd';

export function ListHeader({title, isLoading, onRefresh}) {
  return (
    <div className="flex justify-between items-center">
      <span>{title}</span>
      <Button disabled={isLoading} onClick={onRefresh}>Refresh</Button>
    </div>
  )
}