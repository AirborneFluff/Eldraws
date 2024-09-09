import { baseApi } from './base-api.ts';
import { Guild } from '../../models/guild.ts';

const guildApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserGuilds: builder.query({
      query: () => ({
        url: '/guilds/getUsersGuilds',
        method: 'GET',
      }),
      transformResponse: (response: Guild[]) => response?.length == 0 ? undefined : response,
    })
  }),
  overrideExisting: false,
});

export const { useGetUserGuildsQuery } = guildApi;