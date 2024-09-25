import {baseApi} from './base-api.ts';

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
    overrideExisting: false,
  })
})

export const {
  useCreateEventMutation,
  useGetEventQuery
} = eventApi;