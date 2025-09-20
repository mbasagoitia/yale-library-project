import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import HoldingsFilter from "../components/search-filters/HoldingsFilter";
import HoldingsList from "../components/holdings/HoldingsList";
import { selectFilteredHoldings } from "../../redux/searchSelectors";
import { useState, useEffect } from "react";

const Browse = () => {
  const location = useLocation();
  const filteredItems = useSelector(selectFilteredHoldings);
  const [showResults, setShowResults] = useState(false);
  const search = useSelector((state) => state.search);

  useEffect(() => {
    if (search.searchType) setShowResults(true);
  }, [search]);

  // Keep track of current page in case user navigates back and wants to go to the same page they were on
  const initialPage = location.state?.page || 1;

  return (
    <div className="browse-collection">
      <h1>Browse Collection</h1>

      <div className="holdings-content mt-4">
        <div className="mb-4">
          <h2>Search</h2>
          <div className="mt-4">
            <HoldingsFilter setShowResults={setShowResults} />
          </div>
        </div>

        {showResults && <h2>Results: {filteredItems.length}</h2>}

        <HoldingsList
          filteredItems={filteredItems}
          initialPage={initialPage}
          behavior="search"
        />
      </div>
    </div>
  );
};

export default Browse;
