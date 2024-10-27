import {GuildMember} from "./guild-member.ts";

export interface Guild {
  id: string,
  name: string,
  creatorId: string,
  members: GuildMember[]
}

export interface NewGuild {
  name: string
}