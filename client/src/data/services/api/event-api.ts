import {baseApi} from './base-api.ts';
import { BingoBoardTile, GridPosition } from '../../entities/bingo-board-tile.ts';
import { CreateEventModel, Event } from '../../entities/event.ts';

const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation<void, CreateEventModel>({
      query: (event: CreateEventModel) => ({
        url: '/events',
        method: 'POST',
        body: event
      })
    }),
    getEvent: builder.query<Event, string>({
      query: (id: string) => ({
        url: `/events/${id}`
      })
    }),
    getBingoBoardTiles: builder.query<BingoBoardTile[], string>({
      query: (eventId: string) => ({
        url: `/events/${eventId}/bingo`,
        method: 'GET'
      })
    }),
    bingoBoardTile: builder.mutation<void, { eventId: string, tileId: string, position: GridPosition }>({
      query: ({eventId, tileId, position}) => {
        return {
          url: `/events/${eventId}/bingo`,
          method: 'PUT',
          body: {
            tileId: tileId,
            tilePosition: position
          },
        };
      }
    }),
  }),
  overrideExisting: false,
})

export const {
  useCreateEventMutation,
  useGetEventQuery,
  useBingoBoardTileMutation,
  useGetBingoBoardTilesQuery
} = eventApi;