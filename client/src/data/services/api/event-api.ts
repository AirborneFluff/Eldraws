import {baseApi} from './base-api.ts';
import { GridPosition } from '../../entities/bingo-board-tile.ts';

const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: (event) => ({
        url: '/events',
        method: 'POST',
        body: event
      })
    }),
    getEvent: builder.query({
      query: (id: string) => ({
        url: `/events/${id}`
      })
    }),
    getBingoBoardTiles: builder.query({
      query: (eventId: string) => ({
        url: `/events/${eventId}/bingo`,
        method: 'GET'
      })
    }),
    bingoBoardTile: builder.mutation({
      query: ({ eventId, tileId, position }: {
        eventId: string,
        tileId: string,
        position: GridPosition
      }) => {
        return {
          url: `/events/${eventId}/bingo`,
          method: 'PUT',
          body: {
            tileId: tileId,
            tilePosition: position
          },
        }
      }
    }),
    overrideExisting: false,
  })
})

export const {
  useCreateEventMutation,
  useGetEventQuery,
  useBingoBoardTileMutation,
  useGetBingoBoardTilesQuery
} = eventApi;