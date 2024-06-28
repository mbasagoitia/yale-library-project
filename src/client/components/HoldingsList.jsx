import { useState, useEffect } from "react";
import PieceListItem from "./PieceListItem";
import fetchHoldings from "../helpers/fetchHoldings";

const HoldingsList = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchHoldings();
                console.log("holdings", data);
                setItems(data);
            } catch (error) {
                console.error("Failed to fetch holdings data:", error);
            }
        };

        fetchData();
    }, []);

    // const dummyItems = [
    //     {
    //         title: "Don Juan",
    //         opus: 20,
    //         number: null,
    //         composer: {last_name: "Strauss", first_name: "Richard", id: 20},
    //         publisher: {label: "Luck's Music Library", id: 1}
    //     },
    //     {
    //         title: "Symphony no. 3 in E-flat major",
    //         opus: null,
    //         number: null,
    //         composer: {last_name: "Beethoven", first_name: "Ludwig van", id: 13},
    //         publisher: {label: "Barenreiter", id: 3}
    //     },
    // ];

    return (
        <div className="holdings-list">
            {items.map((item) => (
                <PieceListItem key={item.id} data={item} />
            ))}
        </div>
    )
    
}

export default HoldingsList;