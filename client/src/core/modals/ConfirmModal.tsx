import { Alert, Modal } from 'antd';

interface ConfirmModalProps {
  title: string;
  message: string;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  error?: string;
  loading?: boolean;
}

export function ConfirmModal({title, message, error, open, onConfirm, onCancel, loading = false}: ConfirmModalProps) {
  return (
    <Modal
      title={title}
      open={open}
      okText='Confirm'
      onOk={onConfirm}
      onCancel={onCancel}
      loading={loading}
    >
      <p>{message}</p>
      {error && (
        <Alert className='mt-4' type='error' message={error} />
      )}
    </Modal>
  )
}