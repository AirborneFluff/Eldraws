import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './services/api/base-api.ts';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

export type AppDispatch = typeof store.dispatch