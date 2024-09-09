import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './services/api/base-api.ts';
import { userSlice } from './slices/userSlice.ts';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>