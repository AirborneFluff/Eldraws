import { useEffect, useState } from 'react';
import { Alert, Button, Card, Modal, Upload, UploadFile, UploadProps } from 'antd';
import { useSubmitBingoBoardTileMutation } from '../../../data/services/api/event-api.ts';
import { BingoBoardTile } from '../../../data/entities/bingo-board-tile.ts';
import { useEventDetails } from '../EventDetailsPage.tsx';
import {useSelector} from "react-redux";
import {RootState} from "../../../data/store.ts";
import {User} from "../../../data/entities/user.ts";
import { UploadOutlined } from '@ant-design/icons';
import { MAX_EVIDENCE_SIZE } from '../../../core/constants/blob-storage-limits.ts';

interface SubmitTileModalProps {
  bingoTile: BingoBoardTile,
  open: boolean,
  onCancel: () => void,
  onSuccess: (bingoBoardTile: BingoBoardTile) => void
}

export function SubmitTileModal({bingoTile, open, onCancel, onSuccess}: SubmitTileModalProps) {
  const {user} = useSelector((state: RootState) => state.user) as { user: User };
  const [submitTile, {isLoading, isSuccess, isError, error}] = useSubmitBingoBoardTileMutation();
  const {event} = useEventDetails();

  const [files, setFiles] = useState<UploadFile[]>();
  const [uploadError, setUploadError] = useState<string>(null);
  const latestUserSubmission = bingoTile?.submissions?.find(s => s.appUserId === user.id);

  const props: UploadProps = {
    onRemove: (item) => {
      setFiles(curr => curr?.filter(file => file.uid !== item.uid) ?? []);
    },
    beforeUpload: (uploadFile, fileList) => {
      if (uploadFile.size > MAX_EVIDENCE_SIZE) {
        setUploadError(`Max file size: ${MAX_EVIDENCE_SIZE/1024/1024} MB`)
        return Upload.LIST_IGNORE;
      }

      if (fileList?.length + files?.length > 5) {
        setUploadError("You can only upload 5 files maximum")
        return Upload.LIST_IGNORE;
      }

      setFiles(curr => [...(curr ?? []), uploadFile]);
      setUploadError(null);
      return false;
    }
  };

  useEffect(() => {
    if (isSuccess) {
      onSuccess(bingoTile);
      setFiles([]);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!open) return;
    setFiles([]);
  }, [open]);

  function handleOnFinish() {
    submitTile({
      eventId: event.id,
      bingoBoardTileId: bingoTile.id,
      files: files
    });
  }

  return (
    <Modal
      title="Confirm tile completed"
      open={open}
      okText='Confirm'
      onOk={handleOnFinish}
      onCancel={onCancel}
      loading={isLoading}
    >

      <Upload {...props} accept='image/*,video/*' multiple>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
        {uploadError && <Alert className='mt-2' message={uploadError} type='error' />}
      </Upload>

      {bingoTile?.tile && (
        <Alert
          className='my-4'
          type='info'
          message={bingoTile.tile.description}
          description={bingoTile.tile.conditions}/>
      )}
      <Card className='flex justify-center items-center'>
        <div className='flex justify-center items-center gap-2 flex-col rounded min-h-24 p-2'>
          <img className='p-0.5' alt='Tile Image' src={bingoTile?.tile?.imagePath} />
          <div className='font-bold text-gray-600 text-center text-sm'>{bingoTile?.tile?.task}</div>
        </div>
      </Card>

      {latestUserSubmission && (
        <Alert
          className='my-4'
          type='warning'
          message='Previous submission was rejected:'
          description={latestUserSubmission?.notes ?? 'No reason was given'}/>
      )}

      {isError &&
        <Alert
          className='my-4'
          type='error'
          description={error?.message}/>
      }
    </Modal>
  )
}