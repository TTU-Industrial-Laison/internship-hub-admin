import { AuthState, AuthUser } from "@/types/auth";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // true until we check session
  csrfToken: null,
  isUploadingImage: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; csrfToken?: string }>
    ) => {
      state.user = action.payload.user;
      if (action.payload.csrfToken) {
        state.csrfToken = action.payload.csrfToken;
      }
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.csrfToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUploadingImage: (state, action: PayloadAction<boolean>) => {
      state.isUploadingImage = action.payload;
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  setLoading,
  setUploadingImage,
} = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectIsUploadingImage = (state: RootState) =>
  state.auth.isUploadingImage;

export default authSlice.reducer;
