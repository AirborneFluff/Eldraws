import {baseApi} from './base-api.ts';
import {Guild} from '../../models/guild.ts';
import {ApplicationResponseAction} from "../../types/application-response-action.ts";

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
    getGuild: builder.query({
      query: (id: string) => {
        return {
          url: `/guilds/${id}`,
          method: 'GET',
        };
      }
    }),
    getGuildApplications: builder.query({
      query: (id: string) => {
        return {
          url: `/guilds/${id}/applications`,
          method: 'GET',
        };
      }
    }),
    applicationResponse: builder.mutation({
      query: ({guildId, applicationId, action}: {
        guildId: string,
        applicationId: string,
        action: ApplicationResponseAction
      }) => {
        return {
          url: `/guilds/${guildId}/applications/${applicationId}/${action}`,
          method: 'POST'
        }
      }
    }),
    deleteGuild: builder.mutation({
      query: (guildId: string) => {
        return {
          url: `/guilds/${guildId}`,
          method: 'DELETE'
        }
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
  useGetGuildApplicationsQuery,
  useApplicationResponseMutation,
  useDeleteGuildMutation
} = guildApi;