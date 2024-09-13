import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../entities/user.ts';
import { AppDispatch } from '../store.ts';
import { authApi } from '../services/api/auth-api.ts';

const initialState: userSliceState = {
  user: null
}

interface userSliceState {
  user: User | null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  }
})

export const { setUser, clearUser } = userSlice.actions;

export const loginUser = () => async (dispatch: AppDispatch) => {
  try {
    const loginResult = await dispatch(authApi.endpoints.getUser.initiate()).unwrap() as User;
    dispatch(setUser(loginResult));
  } catch (error) {
    console.error('Login failed', error);
  }
};