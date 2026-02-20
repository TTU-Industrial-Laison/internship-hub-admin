import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface DashboardState {
  selectedPeriodId: string | undefined;
}

const initialState: DashboardState = {
  selectedPeriodId: undefined,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSelectedPeriodId: (state, action: PayloadAction<string | undefined>) => {
      state.selectedPeriodId = action.payload;
    },
  },
});

export const { setSelectedPeriodId } = dashboardSlice.actions;

export const selectSelectedPeriodId = (state: RootState) =>
  state.dashboard.selectedPeriodId;

export default dashboardSlice.reducer;
