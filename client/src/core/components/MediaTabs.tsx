import { BlobMedia } from '../../data/models/blob-media.ts';
import { categorizeMimeType } from '../utils/mime-helper.ts';
import { Alert, Carousel, Image, Skeleton, Tabs, TabsProps } from 'antd';
import { FALLBACK_IMAGE } from '../constants/image-constants.ts';

export function MediaTabs({content, loading}: {content: BlobMedia[], loading: boolean}) {
  const imageUrls = content
    ?.filter(item => categorizeMimeType(item.contentType) === 'image')
    ?.map(item => item.url);

  const videoUrls = content
    ?.filter(item => categorizeMimeType(item.contentType) === 'video')
    ?.map(item => item.url);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Images',
      children: (
        <div className='mb-4 min-h-56'>
          {imageUrls?.length > 0 ? (
            <div className='flex justify-center'>
              <Image.PreviewGroup
                items={imageUrls}
              >
                <Image
                  fallback={FALLBACK_IMAGE}
                  height={224}
                  src={imageUrls[0]}
                />
              </Image.PreviewGroup>
            </div>
          ) : (
            <Alert message='Nothing to see here' description='No photo evidence has been uploaded for this submission' />
          )}
        </div>
      ),
    },
    {
      key: '2',
      label: 'Videos',
      children: (
        <div className='mb-4 min-h-56'>
          {videoUrls?.length > 0 ? (
            <Carousel arrows>
              {videoUrls?.map(renderVideo)}
            </Carousel>
          ) : (
            <Alert message='Nothing to see here' description='No video evidence has been uploaded for this submission' />
          )}
        </div>
      ),
    }
  ];

  const loadingItems: TabsProps['items'] = [
    {
      key: "1",
      label: "Images",
      children: (
        <div className="flex justify-center mb-4 min-h-56">
          <Skeleton.Image style={{ height: '100%', width: 200 }} active />
        </div>
      )
    },
    {
      key: '2',
      label: 'Videos',
      children: (
        <div className="flex justify-center mb-4 min-h-56">
          <Skeleton.Button block active style={{ height: '100%' }} />
        </div>
      ),
    }
  ];


  return (
    <Tabs
      centered
      defaultActiveKey="1"
      items={loading ? loadingItems : items}/>
  );
}

const renderVideo = (url: string) => {
  return (
    <video src={url} controls className="max-w-full max-h-56">
      Your browser does not support the video tag.
    </video>
  );
}
