import { EventParticipant } from './event-participant.ts';

export interface RaffleEntry {
  id: string;
  participant: EventParticipant;
  donation: number;
  lowTicket: number;
  highTicket: number;
  complimentary: boolean;
}

export interface NewRaffleEntry {
  eventId: string;
  participantId: string;
  donation: number;
  complimentary: boolean;
}