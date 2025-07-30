import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import HoldingsList from "../components/holdings/HoldingsList";
import HoldingsFilter from "../components/search-filters/HoldingsFilter";

const Browse = () => {
    const holdingsData = useSelector(state => state.library.holdings);
    // Use memoized selector for filteredHoldings

    const [filteredItems, setFilteredItems] = useState([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (holdingsData && holdingsData.length > 0) {
          setFilteredItems(holdingsData);
        }
      }, [holdingsData]);

    return (
        holdingsData.length > 0 && (
            <div className="browse-collection">
            <h1>Browse Collection</h1>
            <div className="holdings-content mt-4">
                <div className="mb-4">
                    <HoldingsFilter setShowResults={setShowResults} setFilteredItems={setFilteredItems} />
                </div>
                {showResults ? <h2>Results: {filteredItems.length}</h2> : null}
                <HoldingsList filteredItems={filteredItems} />
            </div>
        </div>
        )
    )
}

export default Browse;