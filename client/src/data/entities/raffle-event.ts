import { CreateEventModel } from './event.ts';

export interface RaffleEventExtras {
  entryCost: number,
  prizeDrawDate: string,
  totalTickets?: number,
  totalDonations?: number
}

export interface CreateRaffleEvent extends CreateEventModel {
  entryCost: number,
  prizeDrawDate: string
}