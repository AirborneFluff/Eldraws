import { Guild } from './guild.ts';

export interface GuildApplication {
  id: string,
  appUserId: string,
  guildId: string,
  guild: Guild,
  userName: string,
  gamertag: string
}