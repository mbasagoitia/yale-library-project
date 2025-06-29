import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchHoldingsFromAPI from "../../src/client/helpers/holdings/fetchHoldings";

export const fetchHoldings = createAsyncThunk('library/fetchHoldings', async () => {
  const data = await fetchHoldingsFromAPI();
  return data;
});

const librarySlice = createSlice({
  name: 'library',
  initialState: {
    holdings: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearHoldings: (state) => {
      state.holdings = [];
    },
    addHolding: (state, action) => {
      state.holdings.push(action.payload);
    },
    updateHolding: (state, action) => {
      const updated = action.payload;
      const index = state.holdings.findIndex(piece => piece.id === updated.id);
      if (index !== -1) {
        state.holdings[index] = updated;
      }
    },
    deleteHolding: (state, action) => {
      const idToDelete = action.payload;
      state.holdings = state.holdings.filter(piece => piece.id !== idToDelete);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHoldings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHoldings.fulfilled, (state, action) => {
        state.holdings = action.payload;
        state.loading = false;
      })
      .addCase(fetchHoldings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  clearHoldings,
  addHolding,
  updateHolding,
  deleteHolding
} = librarySlice.actions;

export default librarySlice.reducer;
