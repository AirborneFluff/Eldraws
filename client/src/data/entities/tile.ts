export interface Tile {
  id: string,
  guildId: string | undefined,
  task: string,
  description: string,
  conditions: string,
  imagePath: string
}