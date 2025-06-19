import { useState } from "react";
import { Button } from 'react-bootstrap';
import PieceListItem from "./PieceListItem";

const itemsPerPage = 10;

const HoldingsList = ({ filteredItems }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="holdings-list-container">
      <div className="holdings-list">
        {currentItems.map((item) => (
          <PieceListItem key={item.id} data={item} />
        ))}
      </div>

      <div className="pagination-controls">
        <Button variant="outline-primary" onClick={handlePrev} disabled={currentPage === 1}>
          ← Prev
        </Button>

        {Array.from({ length: totalPages }, (_, idx) => (
          <Button variant="outline-primary"
            key={idx + 1}
            onClick={() => handlePageClick(idx + 1)}
            className={currentPage === idx + 1 ? "active" : ""}
          >
            {idx + 1}
          </Button>
        ))}

        <Button variant="outline-primary" onClick={handleNext} disabled={currentPage === totalPages}>
          Next →
        </Button>
      </div>
    </div>
  );
};

export default HoldingsList;
