import { Alert, Button, Card, Form, Input, Modal, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useCreateTileMutation, useGetTileImagesQuery } from '../../../data/services/api/tile-api.ts';
import { CreateTileModel } from '../../../data/entities/tile.ts';
import { TileImageUploader } from '../components/TileImageUploader.tsx';
const { TextArea } = Input;

export function CreateTileModal({guildId, open, onSuccess, onCancel}) {
  const [createTile, {isLoading, isError, error, isSuccess}] = useCreateTileMutation();
  const {data, isFetching: imagesLoading, refetch} = useGetTileImagesQuery();
  const [uploadedFileUrls, setUploadedFileUrls] = useState<string[]>([]);
  const [form] = Form.useForm<CreateTileModel>();
  const [selectedImagePath, setSelectedImagePath] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    setSelectedImagePath(null);
    refetchImages();
  }, [open]);

  function refetchImages() {
    setUploadedFileUrls([]);
    refetch();
  }

  function handleOnFinish(values: CreateTileModel) {
    if (selectedImagePath == null) return;

    const newTile: CreateTileModel = {
      ...values,
      imagePath: selectedImagePath,
      guildId: guildId
    }

    createTile(newTile);
  }

  function handleOnFileUpload(url: string) {
    setUploadedFileUrls(curr => [...curr, url]);
    setSelectedImagePath(url);
  }

  const tileImageUrls = [...uploadedFileUrls, ...(data ?? [])]

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

        <Card className="flex justify-center items-center">
          {imagesLoading ? (
            <Spin size="large"/>
          ) : (
            <div className="flex justify-center items-center w-full">
              <div className="flex gap-1 flex-wrap justify-start max-h-36 sm:max-h-96 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {tileImageUrls?.map((src, index) => (
                  <Button
                    size="large"
                    key={index}
                    type={selectedImagePath === src ? 'primary' : 'default'}
                    onClick={() => setSelectedImagePath(src)}
                    icon={<img className="p-0.5" alt="Tile Image" src={src} />}
                  />
                ))}
              </div>
            </div>
          )}
        </Card>
        <TileImageUploader onFileUploaded={handleOnFileUpload} />
      </Form>
    </Modal>
  )
}

