import {GuildRoleName} from "./guild-role.ts";

export interface GuildMember {
  guildId: string,
  appUserId: string,
  roleId: string,
  userName: string,
  gamertag: string,
  roleName: GuildRoleName
}

export interface GuildMemberUpdate {
  guildId: string,
  appUserId: string,
  roleName: GuildRoleName
}