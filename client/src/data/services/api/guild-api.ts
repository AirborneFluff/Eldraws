import { baseApi } from './base-api.ts';
import { Guild } from '../../models/guild.ts';
import { GuildApplication } from '../../models/guild-application.ts';

const guildApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserGuilds: builder.query({
      query: () => ({
        url: '/guilds/getUsersGuilds',
        method: 'GET',
      }),
      transformResponse: (response: Guild[]) => response?.length == 0 ? undefined : response,
    }),
    createGuild: builder.mutation({
      query: (guild) => ({
        url: '/guilds',
        method: 'POST',
        body: guild
      })
    }),
    applyToGuild: builder.mutation({
      query: (guildId: string) => {
        return {
          url: `/guilds/${guildId}/apply`,
          method: 'POST'
        }
      }
    }),
    searchGuilds: builder.query({
      query: (searchTerm: string) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('searchTerm', searchTerm);

        return {
          url: `/guilds/search?${params.toString()}`,
          method: 'GET',
        };
      }
    }),
    getGuild: builder.query<Guild>({
      query: (id: string) => {
        return {
          url: `/guilds/${id}`,
          method: 'GET',
        };
      }
    }),
    getGuildApplications: builder.query<GuildApplication[]>({
      query: (id: string) => {
        return {
          url: `/guilds/${id}/applications`,
          method: 'GET',
        };
      }
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserGuildsQuery,
  useSearchGuildsQuery,
  useCreateGuildMutation,
  useApplyToGuildMutation,
  useGetGuildQuery,
  useGetGuildApplicationsQuery } = guildApi;