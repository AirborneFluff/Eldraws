import { baseApi } from './base-api.ts';

const tileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTile: builder.mutation({
      query: (tile) => ({
        url: '/tiles',
        method: 'POST',
        body: tile
      })
    }),
    getTileImages: builder.query({
      query: () => ({
        url: '/tiles/images',
        method: 'GET'
      })
    }),
    overrideExisting: false,
  })
})

export const {
  useCreateTileMutation,
  useGetTileImagesQuery
} = tileApi;