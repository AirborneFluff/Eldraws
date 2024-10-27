import {baseApi} from './base-api.ts';
import { Guild, NewGuild } from '../../entities/guild.ts';
import {MemberAction} from "../../types/member-action.ts";
import {BlacklistedUser} from "../../entities/blacklisted-user.ts";
import { Tile } from '../../entities/tile.ts';
import { GuildApplication } from '../../entities/guild-application.ts';
import { Event } from '../../entities/event.ts';
import {GuildMember, GuildMemberUpdate} from '../../entities/guild-member.ts';
import { ApplicationResponseBody } from '../../models/application-response-body.ts';
import {GuildRole} from "../../entities/guild-role.ts";

const guildApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserGuilds: builder.query<Guild[], void>({
      query: () => ({
        url: '/guilds/getUsersGuilds',
        method: 'GET',
      })
    }),
    createGuild: builder.mutation<void, NewGuild>({
      query: (guild: NewGuild) => ({
        url: '/guilds',
        method: 'POST',
        body: guild
      })
    }),
    applyToGuild: builder.mutation<void, string>({
      query: (guildId: string) => {
        return {
          url: `/guilds/${guildId}/apply`,
          method: 'POST'
        }
      }
    }),
    searchGuilds: builder.query<Guild[], string>({
      query: (searchTerm: string) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('searchTerm', searchTerm);

        return {
          url: `/guilds/search?${params.toString()}`,
          method: 'GET',
        };
      }
    }),
    getGuild: builder.query<Guild, string>({
      query: (guildId: string) => {
        return {
          url: `/guilds/${guildId}`,
          method: 'GET',
        };
      }
    }),
    getGuildApplications: builder.query<GuildApplication[], string>({
      query: (id: string) => {
        return {
          url: `/guilds/${id}/applications`,
          method: 'GET',
        };
      }
    }),
    getGuildBlacklistedUsers: builder.query<BlacklistedUser[], string>({
      query: (guildId: string) => {
        return {
          url: `/guilds/${guildId}/blacklist`,
          method: 'GET',
        };
      }
    }),
    getGuildMembers: builder.query<GuildMember[], string>({
      query: (guildId: string) => {
        return {
          url: `/guilds/${guildId}/members`,
          method: 'GET',
        };
      }
    }),
    applicationResponse: builder.mutation<void, ApplicationResponseBody>({
      query: ({guildId, applicationId, action}: ApplicationResponseBody) => {
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
    memberAction: builder.mutation<void, {guildId: string, appUserId: string, action: MemberAction}>({
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
    removeBlacklistedUser: builder.mutation<void, BlacklistedUser>({
      query: ({guildId, userName}: BlacklistedUser) => {
        return {
          url: `/guilds/${guildId}/blacklist/${userName}`,
          method: 'DELETE'
        }
      }
    }),
    blacklistUser: builder.mutation<void, BlacklistedUser>({
      query: ({guildId, userName}: BlacklistedUser) => {
        return {
          url: `/guilds/${guildId}/blacklist/${userName}`,
          method: 'POST'
        }
      }
    }),
    archiveGuild: builder.mutation<void, string>({
      query: (guildId: string) => {
        return {
          url: `/guilds/${guildId}`,
          method: 'DELETE'
        }
      }
    }),
    getGuildEvents: builder.query<Event[], string>({
      query: (guildId: string) => {
        return {
          url: `/guilds/${guildId}/events`,
          method: 'GET'
        }
      }
    }),
    getGuildTiles: builder.query<Tile[], string>({
      query: (guildId: string) => {
        return {
          url: `/guilds/${guildId}/tiles`,
          method: 'GET'
        }
      }
    }),
    updateGuildMemberRole: builder.mutation<GuildRole, GuildMemberUpdate>({
      query: ({guildId, appUserId, roleName}) => {
        return {
          url: `/guilds/${guildId}/members/${appUserId}/role`,
          method: 'PUT',
          body: {
            roleName
          }
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
  useDeleteGuildMutation,
  useGetGuildMembersQuery,
  useMemberActionMutation,
  useGetGuildBlacklistedUsersQuery,
  useRemoveBlacklistedUserMutation,
  useBlacklistUserMutation,
  useArchiveGuildMutation,
  useGetGuildEventsQuery,
  useGetGuildTilesQuery,
  useUpdateGuildMemberRoleMutation
} = guildApi;