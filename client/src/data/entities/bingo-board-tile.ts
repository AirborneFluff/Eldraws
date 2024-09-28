import { Tile } from './tile.ts';

export interface BingoBoardTile {
  id: string,
  tile: Tile | null,
  position: GridPosition
}

export interface GridPosition {
  column: number,
  row: number
}