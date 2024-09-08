import { baseApi } from './base-api.ts';
import { User } from '../../models/user';
import { AppDispatch } from '../../store.ts';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => ({
        url: '/auth/getUser',
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),
    logout: builder.mutation({
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

export const performGetUser = (dispatch: AppDispatch) => async (): Promise<User | null> => {
  try {
    return await dispatch(authApi.endpoints.getUser.initiate()).unwrap();
  } catch (error) {
    return null;
  }
};