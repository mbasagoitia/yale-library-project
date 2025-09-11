import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PieceListItem from "./PieceListItem";
import PaginationControls from "../general/PaginationControls";
import "../../../assets/styles/components/HoldingsList.css";

const ITEMS_PER_PAGE = 10;

const HoldingsList = ({ filteredItems, behavior, initialPage = 1 }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const navigate = useNavigate();

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleItemClick = (id) => {
    // send page info so back returns to the same page
    navigate(`/piece/${id}`, { state: { page: currentPage } });
  };

  return (
    <div className="holdings-list-container">
      <div className="holdings-list">
        {currentItems.map((item) => (
          <PieceListItem
            key={item.id}
            data={item}
            behavior={behavior}
            onClick={() => handleItemClick(item.id)}
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
