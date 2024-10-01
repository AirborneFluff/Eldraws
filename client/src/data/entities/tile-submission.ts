export interface TileSubmission {
  id: string,
  appUserId: string,
  submittedAt: string,
  judgeId: string,
  accepted: boolean,
  notes?: string
}

export interface NewTileSubmission {
  eventId: string,
  bingoBoardTileId: string,
  submittedAt: string
}