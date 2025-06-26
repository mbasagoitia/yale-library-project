import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: null,
  composer: null,
  publisher: null,
  genre: null,
  medium: null
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    basicSearch: (state, action) => {
      state.title = action.payload.netid;
      state.composer = action.payload.isAdmin;
    },
    advancedSearch: (state, action) => {
      state.title = action.payload.title;
      state.composer = action.payload.composer;
      state.publisher = action.payload.publisher;
      state.genre = action.payload.genre;
    }
  },
});

export const { basicSearch, advancedSearch } = searchSlice.actions;
export default searchSlice.reducer;
