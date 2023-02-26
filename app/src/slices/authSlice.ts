import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  email: null,
  userName: null
};

const authSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setSignIn: (state, action) => {
      state.email = action.payload.email;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.userName = action.payload.userName;
    },
    setSignOut: state => {
      state.email = null;
      state.userName = null;
      state.isLoggedIn = false;
    }
  }
});

export const { setSignIn, setSignOut } = authSlice.actions;

export const selectIsLoggedIn = (state: any) => state.userAuth.isLoggedIn;
export const selectEmail = (state: any) => state.userAuth.email;
export const selectUserName = (state: any) => state.userAuth.userName;

export default authSlice.reducer;
