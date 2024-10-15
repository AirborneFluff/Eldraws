import { baseApi } from './base-api.ts';
import { User, UserUpdateModel } from '../../entities/user.ts';
import { AppDispatch } from '../../store.ts';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => ({
        url: '/auth/getUser',
        method: 'GET',
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    updateUser: builder.mutation<void, UserUpdateModel>({
      query: (user) => ({
        url: '/auth',
        method: 'PUT',
        body: user,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useUpdateUserMutation
} = authApi;

export const performLogout = (dispatch: AppDispatch) => async () => {
  try {
    await dispatch(authApi.endpoints.logout.initiate()).unwrap();
  } catch (error) {
    console.error('Logout failed:', error);
  }
};