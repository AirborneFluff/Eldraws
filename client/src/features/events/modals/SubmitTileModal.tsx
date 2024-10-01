import { useEffect } from 'react';
import { Card, DatePicker, Form, Modal, Spin } from 'antd';
import dayjs from 'dayjs';

export function SubmitTileModal({selectedBingoTile, open, onCancel}) {
  //const [selectedTile, setSelectedTile] = useState<Tile | undefined>(undefined);
  // const tiles = data as Tile[];
  const [form] = Form.useForm();
  //const {eventId} = useParams();

  /*useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess]);*/

  useEffect(() => {
    if (!open) return;
    form.resetFields();
  }, [open]);

  function handleOnFinish() {
    /*bingoBoardTile({
      eventId: eventId,
      tileId: selectedTile.id,
      position: selectedPosition
    });*/
  }

  return (
    <Modal
      title="Confirm tile completed"
      open={open}
      okText='Confirm'
      onOk={() => form.submit()}
      onCancel={onCancel}
      loading={false}
    >
      <Form
        className='mt-8'
        form={form}
        disabled={false}
        name="basic"
        initialValues={{remember: true}}
        onFinish={handleOnFinish}
        autoComplete="off"
      >

        <Form.Item label='Submitted At' name='submittedAt'>
          <DatePicker defaultValue={dayjs()} showTime />
        </Form.Item>

      </Form>
      <Card className='flex justify-center items-center'>
        {false ? (
          <Spin size='large' />
        ) : (
          <div className='flex justify-center items-center gap-2 flex-col rounded min-h-24 p-2'>
            <img className='p-0.5' alt='Tile Image' src={selectedBingoTile?.tile?.imagePath} />
            <div className='font-bold text-gray-600 text-center text-sm'>{selectedBingoTile?.tile?.task}</div>
          </div>
        )}
      </Card>
    </Modal>
  )
}