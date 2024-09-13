import {GuildRole} from "../types/guild-role.ts";

export interface GuildMember {
  guildId: string,
  appUserId: string,
  roleId: string,
  userName: string,
  email: string,
  roleName: GuildRole
}