import { useState, useEffect } from "react";
import fetchHoldings from "../helpers/fetchHoldings";
import HoldingsList from "../components/HoldingsList";
import HoldingsFilter from "../components/HoldingsFilter";

const Browse = () => {

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
            <div className="browse">
            <h1>Browse Collection</h1>
            <div className="holdings-content mt-4">
                <HoldingsFilter holdingsData={holdingsData} setFilteredItems={setFilteredItems} />
                <HoldingsList filteredItems={filteredItems} />
            </div>
        </div>
        )
    )
}

export default Browse;