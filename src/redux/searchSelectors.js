import { createSelector } from '@reduxjs/toolkit';
import filterSearch from '../client/helpers/search/filterSearch';

const selectSearchState = (state) => state.search;
const selectAllHoldings = (state) => state.library.holdings;

export const selectFilteredHoldings = createSelector(
  [selectSearchState, selectAllHoldings],
  (search, holdings) => {
    return filterSearch(
      {
        searchType: search.searchType,
        generalQuery: search.generalQuery,
        filters: search.filters
      },
      holdings
    );
  }
);