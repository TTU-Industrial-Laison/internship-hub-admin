"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth-slice";
import searchFilterReducer from "./slices/search-filter-slice";

// 🔒 Singleton store (client-side)
let store: ReturnType<typeof makeStore> | undefined;

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      searchFilter: searchFilterReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });

// ✅ Deterministic store getter
export const getStore = () => {
  if (typeof window === "undefined") {
    // SSR: create a new one per request (isolated)
    return makeStore();
  }
  if (!store) store = makeStore();
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
