import { useState } from "react";
import PieceListItem from "./PieceListItem";
import PaginationControls from "../general/PaginationControls";

const HoldingsList = ({ filteredItems }) => {
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="holdings-list-container">
      <div className="holdings-list">
        {currentItems.map((item) => (
          <PieceListItem key={item.id} data={item} />
        ))}
      </div>

      <PaginationControls
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={filteredItems.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default HoldingsList;
