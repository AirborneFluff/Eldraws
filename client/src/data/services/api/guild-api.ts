import {baseApi} from './base-api.ts';
import {Guild} from '../../entities/guild.ts';
import {ApplicationResponseAction} from "../../types/application-response-action.ts";
import {MemberAction} from "../../types/member-action.ts";
import {BlacklistedUser} from "../../entities/blacklisted-user.ts";

const guildApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserGuilds: builder.query({
      query: () => ({
        url: '/guilds/getUsersGuilds',
        method: 'GET',
      }),
      transformResponse: (response: Guild[]) => response?.length == 0 ? undefined : response
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
    getGuildBlacklistedUsers: builder.query({
      query: (guildId: string) => {
        return {
          url: `/guilds/${guildId}/blacklist`,
          method: 'GET',
        };
      }
    }),
    getGuildMembers: builder.query({
      query: (id: string) => {
        return {
          url: `/guilds/${id}/members`,
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
    memberAction: builder.mutation({
      query: ({guildId, appUserId, action}: {
        guildId: string,
        appUserId: string,
        action: MemberAction
      }) => {
        return {
          url: `/guilds/${guildId}/members/${appUserId}/${action}`,
          method: 'POST'
        }
      }
    }),
    removeBlacklistedUser: builder.mutation({
      query: ({guildId, userName}: BlacklistedUser) => {
        return {
          url: `/guilds/${guildId}/blacklist/${userName}`,
          method: 'DELETE'
        }
      }
    }),
    blacklistUser: builder.mutation({
      query: ({guildId, userName}: BlacklistedUser) => {
        return {
          url: `/guilds/${guildId}/blacklist/${userName}`,
          method: 'POST'
        }
      }
    }),
    archiveGuild: builder.mutation({
      query: (guildId: string) => {
        return {
          url: `/guilds/${guildId}`,
          method: 'DELETE'
        }
      }
    }),
    getGuildEvents: builder.query({
      query: (guildId: string) => {
        return {
          url: `/guilds/${guildId}/events`,
          method: 'GET'
        }
      }
    }),
    getGuildTiles: builder.query({
      query: (guildId: string) => {
        return {
          url: `/guilds/${guildId}/tiles`,
          method: 'GET'
        }
      }
    })
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
  useDeleteGuildMutation,
  useGetGuildMembersQuery,
  useMemberActionMutation,
  useGetGuildBlacklistedUsersQuery,
  useRemoveBlacklistedUserMutation,
  useBlacklistUserMutation,
  useArchiveGuildMutation,
  useGetGuildEventsQuery,
  useGetGuildTilesQuery
} = guildApi;