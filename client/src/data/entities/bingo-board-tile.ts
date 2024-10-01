import { Tile } from './tile.ts';
import { TileSubmission } from './tile-submission.ts';

export interface BingoBoardTile {
  id: string,
  tile: Tile | null,
  position: GridPosition,
  submissions: TileSubmission[],
}

export interface GridPosition {
  column: number,
  row: number
}