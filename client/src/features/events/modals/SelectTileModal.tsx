import { Card, Modal, Spin } from 'antd';
import { useGetGuildTilesQuery } from '../../../data/services/api/guild-api.ts';
import { Tile } from '../../../data/entities/tile.ts';
import { useEffect, useState } from 'react';
import { useBingoBoardTileMutation } from '../../../data/services/api/event-api.ts';
import { useEventDetails } from '../EventDetailsPage.tsx';

export function SelectTileModal({selectedBingoTile, open, onSuccess, onCancel}) {
  const {event} = useEventDetails();

  const [bingoBoardTile, {isLoading, isSuccess}] = useBingoBoardTileMutation();
  const {data: tiles, isFetching: isTilesLoading, refetch: refetchTiles} = useGetGuildTilesQuery(event.guildId);
  const [selectedTile, setSelectedTile] = useState<Tile | undefined>(undefined);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!open) return;
    setSelectedTile(undefined);
    refetchTiles();
  }, [open]);

  function onSubmit() {
    bingoBoardTile({
      eventId: event.id,
      tileId: selectedTile.id,
      position: selectedBingoTile.position
    });
  }

  function isSelectedTile(tile: Tile) {
    if (selectedTile == undefined) return false;
    return tile.id === selectedTile.id;
  }

  return (
    <Modal
      title="Select a tile"
      open={open}
      okText='Submit'
      onOk={onSubmit}
      onCancel={onCancel}
      loading={isLoading}
    >
      <Card className='flex justify-center items-center'>
        {isTilesLoading ? (
          <Spin size='large' />
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-96 items-stretch overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
            {tiles?.map((tile, index) => (
              <div key={index} className={isSelectedTile(tile) ? 'border border-lime-800' : 'border border-gray-200'}>
                <div
                  onClick={() => setSelectedTile(tile)}
                  className='flex justify-center items-center gap-2 flex-col cursor-pointer rounded min-h-24 p-2'>
                  <img className='p-0.5' alt='Tile Image' src={tile.imagePath} />
                  <div className='font-bold text-gray-600 text-center text-sm'>{tile.task}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Modal>
  )
}