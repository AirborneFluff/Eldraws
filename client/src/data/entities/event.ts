export interface Event {
  id: string,
  guildId: string,
  hostId: string,
  title: string,
  subtitle: string,
  description: string,
  createdDate: string,
  startDate: string,
  endDate: string,
  entryOpenDate: string,
  entryCloseDate: string,
  type: EventType
}

export interface CreateEventModel {
  guildId: string,
  title: string,
  subtitle: string,
  description: string,
  createDate: string,
  startDate: string,
  endDate: string,
  entryOpenDate: string,
  entryCloseDate: string
  type: EventType
}

export enum EventType {
  TileRace,
  Bingo,
}