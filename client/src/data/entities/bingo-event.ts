import { CreateEventModel } from './event.ts';

export interface BingoEventExtras {
  columnCount: number,
  rowCount: number
}

export interface CreateBingoEvent extends CreateEventModel {
  columnCount: number,
  rowCount: number
}