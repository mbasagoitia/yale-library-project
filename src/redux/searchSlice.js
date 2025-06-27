import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchType: null, // 'general' | 'basic' | 'advanced'

  // general search (from navbar)
  generalQuery: null,

  // basic & advanced filters from Browse Page
  filters: {
    title: null,
    composer: null,
    publisher: null,
    genre: null,
    medium: null,
  },
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    generalSearch: (state, action) => {
      state.searchType = 'general';
      state.generalQuery = action.payload.query;
    },
    basicSearch: (state, action) => {
      state.searchType = 'basic';
      state.generalQuery = null;
      state.filters.title = action.payload.title || null;
      state.filters.composer = action.payload.composer || null;

      state.filters.publisher = null;
      state.filters.genre = null;
      state.filters.medium = null;
    },
    advancedSearch: (state, action) => {
      state.searchType = 'advanced';
      state.generalQuery = null;
      state.filters.title = action.payload.title || null;
      state.filters.composer = action.payload.composer || null;
      state.filters.publisher = action.payload.publisher || null;
      state.filters.genre = action.payload.genre || null;
      state.filters.medium = action.payload.medium || null;
    },
    clearSearch: () => initialState,
  },
});

export const {
  generalSearch,
  basicSearch,
  advancedSearch,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
