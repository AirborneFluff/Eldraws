import {baseApi} from './base-api.ts';
import { BingoBoardTile, GridPosition } from '../../entities/bingo-board-tile.ts';
import { CreateEventModel, Event } from '../../entities/event.ts';
import { NewTileSubmission, TileSubmissionResponse } from '../../entities/tile-submission.ts';
import { BlobMedia } from '../../models/blob-media.ts';

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
    startEvent: builder.mutation<void, string>({
      query: (eventId) => ({
        url: `/events/${eventId}/start`,
        method: 'POST'
      })
    }),
    getBingoBoardTiles: builder.query<BingoBoardTile[], string>({
      query: (eventId) => ({
        url: `/events/${eventId}/bingo`,
        method: 'GET'
      })
    }),
    getBingoBoardTilesPeak: builder.query<BingoBoardTile[], string>({
      query: (eventId) => ({
        url: `/events/${eventId}/bingo/peak`,
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
      query: ({eventId, bingoBoardTileId, files}) => {
        const formData = new FormData();

        if (files && files.length > 0) {
          files.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
          });
        }

        return {
          url: `/events/${eventId}/bingo/${bingoBoardTileId}/submit`,
          method: 'POST',
          body: formData
        };
      }
    }),
    sendTileSubmissionResponse: builder.mutation<void, TileSubmissionResponse>({
      query: ({eventId, submissionId, accepted, notes}) => {
        console.log({accepted, notes})
        return {
          url: `/events/${eventId}/bingo/submissions/${submissionId}`,
          method: 'PUT',
          body: {
            accepted,
            notes
          }
        };
      }
    }),
    getTileSubmissionEvidence: builder.query<BlobMedia[], { eventId: string, submissionId: string }>({
      query: ({eventId, submissionId}) => ({
        url: `/events/${eventId}/bingo/submissions/${submissionId}`,
        method: 'GET'
      })
    }),
  }),
  overrideExisting: false,
})

export const {
  useCreateEventMutation,
  useGetEventQuery,
  useStartEventMutation,
  useBingoBoardTileMutation,
  useLazyGetBingoBoardTilesQuery,
  useGetBingoBoardTilesQuery,
  useLazyGetBingoBoardTilesPeakQuery,
  useSubmitBingoBoardTileMutation,
  useSendTileSubmissionResponseMutation,
  useLazyGetTileSubmissionEvidenceQuery
} = eventApi;