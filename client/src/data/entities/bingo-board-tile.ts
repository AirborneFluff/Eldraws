import { Tile } from './tile.ts';

export interface BingoBoardTile {
  id: string,
  tile: Tile | null,
  column: number,
  row: number
}