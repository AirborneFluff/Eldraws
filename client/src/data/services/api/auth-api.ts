import { baseApi } from './base-api.ts';
import { User } from '../../entities/user.ts';
import { AppDispatch } from '../../store.ts';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => ({
        url: '/auth/getUser',
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const performLogout = (dispatch: AppDispatch) => async () => {
  try {
    await dispatch(authApi.endpoints.logout.initiate()).unwrap();
  } catch (error) {
    console.error('Logout failed:', error);
  }
};