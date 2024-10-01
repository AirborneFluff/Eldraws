import {baseApi} from './base-api.ts';
import { BingoBoardTile, GridPosition } from '../../entities/bingo-board-tile.ts';
import { CreateEventModel, Event } from '../../entities/event.ts';
import { NewTileSubmission } from '../../entities/tile-submission.ts';

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
      query: (eventId) => ({
        url: `/events/${eventId}`
      })
    }),
    getBingoBoardTiles: builder.query<BingoBoardTile[], string>({
      query: (eventId) => ({
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
    submitBingoBoardTile: builder.mutation<void, NewTileSubmission>({
      query: ({eventId, bingoBoardTileId, submittedAt}) => {
        return {
          url: `/events/${eventId}/bingo/${bingoBoardTileId}/submit`,
          method: 'POST',
          body: {
            submittedAt
          }
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
  useGetBingoBoardTilesQuery,
  useSubmitBingoBoardTileMutation,
} = eventApi;