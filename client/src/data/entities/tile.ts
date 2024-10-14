export interface Tile {
  id: string,
  guildId: string | undefined,
  task: string,
  description: string,
  conditions: string,
  imagePath: string
}

export interface TileForm {
  task: string,
  description: string,
  conditions: string
}

export interface CreateTileModel {
  guildId: string,
  task: string,
  description: string,
  conditions: string,
  imagePath: string
}

export interface UpdateTileModel {
  tileId: string,
  task: string,
  description: string,
  conditions: string,
  imagePath: string
}