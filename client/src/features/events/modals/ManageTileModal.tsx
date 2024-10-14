import { Alert, Button, Card, Form, Input, Modal, Spin } from 'antd';
import { useEffect, useState } from 'react';
import {
  useCreateTileMutation,
  useGetTileImagesQuery,
  useUpdateTileMutation
} from '../../../data/services/api/tile-api.ts';
import { CreateTileModel, Tile, TileForm, UpdateTileModel } from '../../../data/entities/tile.ts';
import { TileImageUploader } from '../components/TileImageUploader.tsx';
const { TextArea } = Input;

interface ManageTileModalProps {
  guildId: string;
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  tile?: Tile | null;
  refetchOnOpen?: boolean;
}

export function ManageTileModal({guildId, open, onSuccess, onCancel, tile = null, refetchOnOpen = true}: ManageTileModalProps) {
  const [createTile, {
    isLoading: isCreateLoading,
    isError: isCreateError,
    error: createError,
    isSuccess: isCreateSuccess}] = useCreateTileMutation();
  const [updateTile, {
    isLoading: isUpdateLoading,
    isError: isUpdateError,
    error: updateError,
    isSuccess: isUpdateSuccess}] = useUpdateTileMutation();
  const {data, isFetching: imagesLoading, refetch} = useGetTileImagesQuery();
  const [uploadedFileUrls, setUploadedFileUrls] = useState<string[]>([]);
  const [form] = Form.useForm<TileForm>();
  const [selectedImagePath, setSelectedImagePath] = useState(null);

  const isSuccess = isCreateSuccess || isUpdateSuccess;
  const isLoading = isCreateLoading || isUpdateLoading;
  const isError = isCreateError || isUpdateError;
  const error = createError || updateError;
  const isEdit = tile != null;

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!open) return;
    form.resetFields();

    if (tile) {
      populateForm(tile);
    }

    if (refetchOnOpen) {
      refetchImages();
    }
  }, [open, tile, refetchOnOpen]);

  function populateForm(tile: Tile) {
    form.setFieldsValue({
      task: tile.task,
      description: tile.description,
      conditions: tile.conditions,
    });
    setSelectedImagePath(tile.imagePath);
  }

  function refetchImages() {
    setUploadedFileUrls([]);
    refetch();
  }

  function handleOnFinish(values: TileForm) {
    if (selectedImagePath == null) return;
    if (isEdit) {
      handleOnUpdate(values);
      return;
    }

    handleOnCreate(values);
  }

  function handleOnUpdate(values: TileForm) {
    const tileUpdate: UpdateTileModel = {
      ...values,
      tileId: tile.id,
      imagePath: selectedImagePath
    }
    updateTile(tileUpdate);
  }

  function handleOnCreate(values: TileForm) {
    const newTile: CreateTileModel = {
      ...values,
      guildId: guildId,
      imagePath: selectedImagePath
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
      okText={isEdit ? 'Update' : 'Create'}
      onOk={() => form.submit()}
      onCancel={onCancel}
      confirmLoading={isLoading}
    >
      <Form
        labelCol={{span: 6}}
        form={form}
        disabled={isLoading}
        name="manageTile"
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

