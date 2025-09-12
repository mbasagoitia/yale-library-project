import { useState } from "react";
import PieceListItem from "./PieceListItem";
import PaginationControls from "../general/PaginationControls";
import "../../../assets/styles/components/HoldingsList.css";

const ITEMS_PER_PAGE = 10;

const HoldingsList = ({ filteredItems, behavior, initialPage = 1 }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="holdings-list-container">
      <div className="holdings-list">
        {currentItems.map((item) => (
          <PieceListItem
            key={item.id}
            data={item}
            behavior={behavior}
            currentPage={currentPage}
          />
        ))}
      </div>

      {filteredItems.length > ITEMS_PER_PAGE && (
        <PaginationControls
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalItems={filteredItems.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
    </div>
  );
};

export default HoldingsList;
