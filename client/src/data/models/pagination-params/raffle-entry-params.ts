import { PaginationParams } from './pagination-params.ts';

export interface RaffleEntryParams extends PaginationParams {
  eventId: string;
}