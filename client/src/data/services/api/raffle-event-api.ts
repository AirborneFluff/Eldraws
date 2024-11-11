import {baseApi} from './base-api.ts';
import { NewRaffleEntry, RaffleEntry } from '../../entities/raffle-entry.ts';
import { RaffleEntryParams } from '../../models/pagination-params/raffle-entry-params.ts';
import {
  createTransformPaginatedResponse,
} from '../../../core/utils/transform-paginated-response.ts';
import { PaginatedResponse } from '../../models/paginated-response.ts';

const raffleEventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRaffleEventDetails: builder.query<any, string>({
      query: (eventId) => ({
        url: `/events/${eventId}/raffle`
      })
    }),
    addRaffleEntry: builder.mutation<any, NewRaffleEntry>({
      query: (dto) => ({
        url: `/events/${dto.eventId}/raffle/entries`,
        method: 'POST',
        body: dto
      })
    }),
    getRaffleEntries: builder.query<PaginatedResponse<RaffleEntry>, RaffleEntryParams>({
      query: (dto) => ({
        url: `/events/${dto.eventId}/raffle/entries`,
        method: 'GET',
        params: {...dto}
      }),
      transformResponse: createTransformPaginatedResponse<RaffleEntry>()
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetRaffleEventDetailsQuery,
  useAddRaffleEntryMutation,
  useLazyGetRaffleEntriesQuery
} = raffleEventApi;