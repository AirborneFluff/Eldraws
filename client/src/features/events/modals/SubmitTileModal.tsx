import { useEffect } from 'react';
import { Alert, Card, DatePicker, Form, Modal, Spin } from 'antd';
import dayjs from 'dayjs';
import { useSubmitBingoBoardTileMutation } from '../../../data/services/api/event-api.ts';
import { NewTileSubmission } from '../../../data/entities/tile-submission.ts';
import { BingoBoardTile } from '../../../data/entities/bingo-board-tile.ts';

type FormTileSubmission = Omit<NewTileSubmission, 'eventId' | 'bingoBoardTileId'>;

interface SubmitTileModalProps {
  eventId: string,
  bingoTile: BingoBoardTile,
  open: boolean,
  onCancel: () => void,
  onSuccess: (bingoBoardTile: BingoBoardTile) => void
}

export function SubmitTileModal({eventId, bingoTile, open, onCancel, onSuccess}: SubmitTileModalProps) {
  const [submitTile, {isLoading, isSuccess, isError, error}] = useSubmitBingoBoardTileMutation();
  const [form] = Form.useForm<FormTileSubmission>();

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
    console.log(bingoTile);
    submitTile({
      eventId: eventId,
      bingoBoardTileId: bingoTile.id,
      submittedAt: form.submittedAt
    });
  }

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

        <Form.Item<string> label='Submitted At' name='submittedAt' initialValue={dayjs()}>
          <DatePicker showTime />
        </Form.Item>

      </Form>
      <Card className='flex justify-center items-center'>
        {false ? (
          <Spin size='large' />
        ) : (
          <div className='flex justify-center items-center gap-2 flex-col rounded min-h-24 p-2'>
            <img className='p-0.5' alt='Tile Image' src={bingoTile?.tile?.imagePath} />
            <div className='font-bold text-gray-600 text-center text-sm'>{bingoTile?.tile?.task}</div>
          </div>
        )}
      </Card>

      {isError &&
        <Alert
          className='my-4'
          type='error'
          description={error?.message}/>
      }
    </Modal>
  )
}