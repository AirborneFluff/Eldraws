import { Alert, Button, Card, Form, Input, Modal, Space, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useCreateTileMutation, useGetTileImagesQuery } from '../../../data/services/api/tile-api.ts';
import { Tile } from '../../../data/entities/tile.ts';
const { TextArea } = Input;

export function CreateTileModal({guildId, open, onSuccess, onCancel}) {
  const [createTile, {isLoading, isError, error, isSuccess}] = useCreateTileMutation();
  const {data: tileImages, isLoading: imagesLoading, isError: imagesError} = useGetTileImagesQuery();
  const [form] = Form.useForm();
  const [selectedImagePath, setSelectedImagePath] = useState('');

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess]);

  function handleOnFinish(values: Partial<Tile>) {
    const newTile: Tile = {
      ...values,
      imagePath: selectedImagePath,
      guildId: guildId
    }

    createTile(newTile);
  }

  return (
    <Modal
      title="Create Custom Tile"
      open={open}
      okText='Create'
      onOk={() => form.submit()}
      onCancel={onCancel}
      confirmLoading={isLoading}
    >
      <Form
        labelCol={{span: 6}}
        form={form}
        disabled={isLoading}
        name="basic"
        style={{maxWidth: 600}}
        initialValues={{remember: true}}
        onFinish={handleOnFinish}
        autoComplete="off"
      >

        <Form.Item<string>
          label="Task"
          name="task"
          rules={[{required: true, message: 'Enter a task!'}]}
        >
          <Input />
        </Form.Item>

        <Form.Item<string>
          label="Description"
          name="description"
          rules={[{required: true, message: 'Enter a task description!'}]}
        >
          <TextArea />
        </Form.Item>

        <Form.Item<string>
          label="Conditions"
          name="conditions"
          rules={[{required: true, message: 'Enter task condition!'}]}
        >
          <TextArea />
        </Form.Item>

        {isError &&
          <Alert
            className='my-4'
            type='error'
            description={error?.message}/>
        }

        <Card className='flex justify-center items-center'>
          {imagesLoading ? (
            <Spin size='large' />
          ) : (
            <Space size={8} wrap className='justify-between max-h-36 sm:max-h-96 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
              {tileImages?.map((src, index) =>
                <Button
                  size='large'
                  key={index}
                  type={selectedImagePath === src ? 'primary' : 'default'}
                  onClick={() => setSelectedImagePath(src)}
                  icon={<img className='p-0.5' alt='Tile Image' src={src} />}
                />
              )}
            </Space>
          )}
        </Card>

      </Form>
    </Modal>
  )
}

