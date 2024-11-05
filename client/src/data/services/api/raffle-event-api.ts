import {baseApi} from './base-api.ts';

const raffleEventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRaffleEventDetails: builder.query<any, string>({
      query: (eventId) => ({
        url: `/events/${eventId}/raffle`
      })
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetRaffleEventDetailsQuery
} = raffleEventApi;