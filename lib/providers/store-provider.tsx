"use client";

import { Provider } from "react-redux";
import { getStore } from "../store/store";

export function StoreProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const store = getStore(); // ✅ stable instance, never re-created
  return <Provider store={store}>{children}</Provider>;
}
