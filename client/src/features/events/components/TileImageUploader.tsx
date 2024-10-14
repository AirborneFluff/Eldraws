import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
const { Dragger } = Upload;

export function TileImageUploader({onFileUploaded}: { onFileUploaded: (url: string) => void }) {
  const uploadUrl = `${window.location.origin}/api/tiles/upload`;

  const beforeUpload = (file: File) => {
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
    if (!isImage) {
      message.error('You can only upload JPG/PNG/WEBP files!');
      return Upload.LIST_IGNORE;
    }
    const isLessThan20KB = file.size / 1024 < 20;
    if (!isLessThan20KB) {
      message.error('Image must be smaller than 20KB!');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    action: uploadUrl,
    showUploadList: false,
    beforeUpload,
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        onFileUploaded(info.file.response);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    }
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
    </Dragger>
  )
}