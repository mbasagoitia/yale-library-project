import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  netid: null,
  isAdmin: false,
  isLoggedIn: false,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.netid = action.payload.netid;
      state.isAdmin = action.payload.isAdmin;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.netid = null;
      state.isAdmin = false;
      state.isLoggedIn = false;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});

export const { login, logout, setToken } = authSlice.actions;
export default authSlice.reducer;
