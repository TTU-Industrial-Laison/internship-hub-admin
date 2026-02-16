import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store/store";
import { FilterState, EntityFilters } from "@/types/store/search-filter";

const initialFilterState: FilterState = {
  searchTerm: "",
  status: "",
  page: 1,
  size: 15,
};

const initialState: EntityFilters = {
  internshipPeriods: initialFilterState,
};

const searchFilterSlice = createSlice({
  name: "searchFilter",
  initialState,
  reducers: {
    setSearchTerm: (
      state,
      action: PayloadAction<{ entity: keyof EntityFilters; searchTerm: string }>
    ) => {
      const { entity, searchTerm } = action.payload;
      state[entity].searchTerm = searchTerm;
      state[entity].page = 1;
    },

    setStatus: (
      state,
      action: PayloadAction<{ entity: keyof EntityFilters; status: string }>
    ) => {
      const { entity, status } = action.payload;
      state[entity].status = status;
      state[entity].page = 1;
    },

    setPage: (
      state,
      action: PayloadAction<{ entity: keyof EntityFilters; page: number }>
    ) => {
      const { entity, page } = action.payload;
      state[entity].page = page;
    },

    setDynamicParam: (
      state,
      action: PayloadAction<{
        entity: keyof EntityFilters;
        key: string;
        value: string | number;
      }>
    ) => {
      const { entity, key, value } = action.payload;
      state[entity][key] = value;
      state[entity].page = 1;
    },

    resetFilters: (
      state,
      action: PayloadAction<{ entity: keyof EntityFilters; keepSize?: boolean }>
    ) => {
      const { entity, keepSize = true } = action.payload;
      const currentSize = state[entity].size;
      state[entity] = {
        ...initialFilterState,
        size: keepSize ? currentSize : initialFilterState.size,
      };
    },

    initializeFromUrl: (
      state,
      action: PayloadAction<{
        entity: keyof EntityFilters;
        params: Partial<FilterState>;
      }>
    ) => {
      const { entity, params } = action.payload;
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          state[entity][key] = value;
        }
      });
    },
  },
});

export const {
  setSearchTerm,
  setStatus,
  setPage,
  setDynamicParam,
  resetFilters,
  initializeFromUrl,
} = searchFilterSlice.actions;

// Selectors
export const selectFiltersByEntity =
  (entity: keyof EntityFilters) => (state: RootState) =>
    state.searchFilter[entity];

export default searchFilterSlice.reducer;
