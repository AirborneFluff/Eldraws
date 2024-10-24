export interface TileSubmission {
  id: string,
  appUserId: string,
  userName: string,
  gamertag: string,
  submittedAt: string,
  judgeId: string,
  accepted: boolean,
  notes?: string
}

export interface NewTileSubmission {
  eventId: string,
  bingoBoardTileId: string,
  files: any[]
}

export interface TileSubmissionResponse {
  eventId: string,
  submissionId: string,
  accepted: boolean,
  notes?: string
}