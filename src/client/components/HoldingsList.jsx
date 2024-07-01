import { useState, useEffect } from "react";
import PieceListItem from "./PieceListItem";
import fetchHoldings from "../helpers/fetchHoldings";

const HoldingsList = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchHoldings();
                setItems(data);
                console.log(data);
            } catch (error) {
                console.error("Failed to fetch holdings data:", error);
            }
        };

        fetchData();
    }, []);


    return (
        <div className="holdings-list">
            {items.map((item) => (
                <PieceListItem key={item.id} data={item} />
            ))}
        </div>
    )
    
}

export default HoldingsList;