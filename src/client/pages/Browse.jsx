import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import HoldingsList from "../components/holdings/HoldingsList";
import HoldingsFilter from "../components/search-filters/HoldingsFilter";
import { selectFilteredHoldings } from "../../redux/searchSelectors";

const Browse = () => {

    const filteredItems = useSelector(selectFilteredHoldings);
    const [showResults, setShowResults] = useState(false);

    const search = useSelector((state) => state.search);

    useEffect(() => {
        if (search.searchType) {
            setShowResults(true);
        }
    }, [])

    return (
            <div className="browse-collection">
            <h1>Browse Collection</h1>
            <div className="holdings-content mt-4">
                <div className="mb-4">
                    <HoldingsFilter setShowResults={setShowResults} />
                </div>
                {showResults ? <h2>Results: {filteredItems.length}</h2> : null}
                <HoldingsList filteredItems={filteredItems} behavior={"search"} />
            </div>
        </div>
    )
}

export default Browse;