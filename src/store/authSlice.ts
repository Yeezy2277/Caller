import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {initialStateType} from '../constants/types';

const initialState: initialStateType = {
  isAuth: false,
  isSignout: false,
  token: '',
};

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setSignout: (state, action: PayloadAction<boolean>) => {
      state.isSignout = action.payload;
    },
  },
});
export const {setAuth, setToken, setSignout} = authSlice.actions;

export default authSlice.reducer;
