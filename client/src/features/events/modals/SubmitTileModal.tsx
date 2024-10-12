import { useEffect } from 'react';
import { Alert, Card, Form, Modal } from 'antd';
import dayjs from 'dayjs';
import { useSubmitBingoBoardTileMutation } from '../../../data/services/api/event-api.ts';
import { BingoBoardTile } from '../../../data/entities/bingo-board-tile.ts';
import { useEventDetails } from '../EventDetailsPage.tsx';
import {useSelector} from "react-redux";
import {RootState} from "../../../data/store.ts";
import {User} from "../../../data/entities/user.ts";
import {DateTimePicker} from "../../../core/forms/DateTimePicker";

interface FormTileSubmission {
  evidenceSubmittedAt: string;

}

interface SubmitTileModalProps {
  bingoTile: BingoBoardTile,
  open: boolean,
  onCancel: () => void,
  onSuccess: (bingoBoardTile: BingoBoardTile) => void
}

export function SubmitTileModal({bingoTile, open, onCancel, onSuccess}: SubmitTileModalProps) {
  const {user} = useSelector((state: RootState) => state.user) as { user: User };
  const [submitTile, {isLoading, isSuccess, isError, error}] = useSubmitBingoBoardTileMutation();
  const [form] = Form.useForm<FormTileSubmission>();
  const {event} = useEventDetails();

  const latestUserSubmission = bingoTile?.submissions?.find(s => s.appUserId === user.id);

  useEffect(() => {
    if (isSuccess) {
      onSuccess(bingoTile);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
  }, [open]);

  function handleOnFinish(form: FormTileSubmission) {
    submitTile({
      eventId: event.id,
      bingoBoardTileId: bingoTile.id,
      evidenceSubmittedAt: form.evidenceSubmittedAt
    });
  }
  const currentTime = dayjs().format("YYYY-MM-DDTHH:mm");

  return (
    <Modal
      title="Confirm tile completed"
      open={open}
      okText='Confirm'
      onOk={() => form.submit()}
      onCancel={onCancel}
      loading={isLoading}
    >
      <Form
        className='mt-8'
        form={form}
        disabled={isLoading}
        name="basic"
        initialValues={{remember: true}}
        onFinish={handleOnFinish}
        autoComplete="off"
      >

        <Form.Item<string> label='Evidence Submitted At' name='evidenceSubmittedAt' initialValue={dayjs()}>
          <DateTimePicker max={currentTime} />
        </Form.Item>

      </Form>
      <Card className='flex justify-center items-center'>
        <div className='flex justify-center items-center gap-2 flex-col rounded min-h-24 p-2'>
          <img className='p-0.5' alt='Tile Image' src={bingoTile?.tile?.imagePath} />
          <div className='font-bold text-gray-600 text-center text-sm'>{bingoTile?.tile?.task}</div>
        </div>
      </Card>

      {latestUserSubmission && (
        <Alert
          className='my-4'
          type='info'
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