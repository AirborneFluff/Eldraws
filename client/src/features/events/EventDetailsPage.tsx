import { CreateTileModal } from './modals/CreateTileModal.tsx';
import { useState } from 'react';

export function EventDetailsPage() {
  const [showCreateTile, setShowCreateTile] = useState(true);

  return (
    <>
      <CreateTileModal
        open={showCreateTile}
        onSuccess={() => null}
        onCancel={() => setShowCreateTile(false)} />
    </>
  )
}