import { baseApi } from './base-api.ts';
import { CreateTileModel } from '../../entities/tile.ts';

const tileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTile: builder.mutation<void, CreateTileModel>({
      query: (tile: CreateTileModel) => ({
        url: '/tiles',
        method: 'POST',
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
  useGetTileImagesQuery
} = tileApi;