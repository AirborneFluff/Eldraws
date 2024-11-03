import {baseApi} from './base-api.ts';
import { Event } from '../../entities/event.ts';
import { CreateBingoEvent } from '../../entities/bingo-event.ts';

const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvent: builder.query<Event, string>({
      query: (eventId) => ({
        url: `/events/${eventId}`
      })
    }),
    createBingoEvent: builder.mutation<void, CreateBingoEvent>({
      query: (event) => ({
        url: `/guilds/${event.guildId}/events/bingo`,
        method: 'POST',
        body: event
      })
    }),
    startEvent: builder.mutation<void, string>({
      query: (eventId) => ({
        url: `/events/${eventId}/start`,
        method: 'POST'
      })
    })
  }),
  overrideExisting: false,
})

export const {
  useGetEventQuery,
  useStartEventMutation,
  useCreateBingoEventMutation
} = eventApi;