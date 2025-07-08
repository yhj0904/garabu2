import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    accessToken: null,
    isAuthenticated: false,
  };
  
  const LoginStatusSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      loginSuccess: (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      },
      logout: (state) => {
        state.accessToken = null;
        state.isAuthenticated = false;
      },
      refreshAccessToken: (state, action) => {
        state.accessToken = action.payload.accessToken;
      },
    },
  });
  
  export const { loginSuccess, logout, refreshAccessToken } = LoginStatusSlice.actions;
  
  export default LoginStatusSlice.reducer;