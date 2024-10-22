import { useEffect, useState } from 'react';
import { Alert, Button, Card, Form, GetProp, Modal, Upload, UploadFile, UploadProps } from 'antd';
import dayjs from 'dayjs';
import { useSubmitBingoBoardTileMutation } from '../../../data/services/api/event-api.ts';
import { BingoBoardTile } from '../../../data/entities/bingo-board-tile.ts';
import { useEventDetails } from '../EventDetailsPage.tsx';
import {useSelector} from "react-redux";
import {RootState} from "../../../data/store.ts";
import {User} from "../../../data/entities/user.ts";
import {DateTimePicker} from "../../../core/forms/DateTimePicker";
import { UploadOutlined } from '@ant-design/icons';

interface FormTileSubmission {
  file: any
}

interface SubmitTileModalProps {
  bingoTile: BingoBoardTile,
  open: boolean,
  onCancel: () => void,
  onSuccess: (bingoBoardTile: BingoBoardTile) => void
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export function SubmitTileModal({bingoTile, open, onCancel, onSuccess}: SubmitTileModalProps) {
  const {user} = useSelector((state: RootState) => state.user) as { user: User };
  const [submitTile, {isLoading, isSuccess, isError, error}] = useSubmitBingoBoardTileMutation();
  const {event} = useEventDetails();

  const [file, setFile] = useState<UploadFile>();

  const latestUserSubmission = bingoTile?.submissions?.find(s => s.appUserId === user.id);

  const props: UploadProps = {
    onRemove: () => {
      setFile(null);
    },
    beforeUpload: (uploadFile) => {
      setFile(uploadFile);
      return false;
    }
  };

  useEffect(() => {
    if (isSuccess) {
      onSuccess(bingoTile);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!open) return;
  }, [open]);

  function handleOnFinish() {
    console.log(file)

    submitTile({
      eventId: event.id,
      bingoBoardTileId: bingoTile.id,
      file: file
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

      <Upload {...props} accept='image/*,video/*' >
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
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