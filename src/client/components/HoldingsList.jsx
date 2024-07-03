import { useState, useEffect } from "react";
import PieceListItem from "./PieceListItem";

const HoldingsList = ({ filteredItems }) => {

    return (
        <div className="holdings-list">
            {filteredItems.map((item) => (
                <PieceListItem key={item.id} data={item} />
            ))}
        </div>
    )
    
}

export default HoldingsList;