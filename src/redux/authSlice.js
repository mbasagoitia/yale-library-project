import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  netid: null,
  isAdmin: false,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.netid = action.payload.netid;
      state.isAdmin = action.payload.isAdmin;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.netid = null;
      state.isAdmin = false;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
