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
    overrideExisting: false,
  })
})

export const {
  useCreateEventMutation
} = eventApi;