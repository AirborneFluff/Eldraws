import { EventType } from '../../data/entities/event.ts';

export function getEventTypeName(type: EventType) {
  return type === EventType.TileRace ? 'Tile Race' :
    type === EventType.GroupBingo ? 'Group Bingo' :
    type === EventType.SoloBingo ? 'Solo Bingo' : undefined
}