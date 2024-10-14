import { baseApi } from './base-api.ts';
import { CreateTileModel, UpdateTileModel } from '../../entities/tile.ts';

const tileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTile: builder.mutation<void, CreateTileModel>({
      query: (tile: CreateTileModel) => ({
        url: '/tiles',
        method: 'POST',
        body: tile
      })
    }),
    updateTile: builder.mutation<void, UpdateTileModel>({
      query: (tile) => ({
        url: `/tiles/${tile.tileId}`,
        method: 'PUT',
        body: tile
      })
    }),
    getTileImages: builder.query<string[], void>({
      query: () => ({
        url: '/tiles/images',
        method: 'GET'
      })
    })
  }),
  overrideExisting: false,
})

export const {
  useCreateTileMutation,
  useUpdateTileMutation,
  useGetTileImagesQuery
} = tileApi;