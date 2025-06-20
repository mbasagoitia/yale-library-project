import { useState, useEffect } from "react";
import fetchHoldings from "../helpers/holdings/fetchHoldings";
import HoldingsList from "../components/holdings/HoldingsList";
import HoldingsFilter from "../components/search-filters/HoldingsFilter";

const Browse = () => {

    // Fetch once and store as global state?

    const [holdingsData, setHoldingsData] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchHoldings();
                setHoldingsData(data);
                if (isInitialLoad) {
                    setFilteredItems(data);
                    setIsInitialLoad(false);
                }
            } catch (error) {
                console.error("Failed to fetch holdings data:", error);
            }
        };
        
        fetchData();
    }, [isInitialLoad]);

    return (
        holdingsData.length > 0 && (
            <div className="browse-collection">
            <h1>Browse Collection</h1>
            <div className="holdings-content mt-4">
                <div className="mb-4">
                    <HoldingsFilter holdingsData={holdingsData} setFilteredItems={setFilteredItems} />
                </div>
                <HoldingsList filteredItems={filteredItems} />
            </div>
        </div>
        )
    )
}

export default Browse;