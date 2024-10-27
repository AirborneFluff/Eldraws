export interface GuildRole {
  id: string;
  guildId: string;
  name: GuildRoleName;
}

export type GuildRoleName = 'Owner' | 'Admin' | 'Moderator' | 'Member';