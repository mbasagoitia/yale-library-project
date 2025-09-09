import React, { Fragment } from "react";
import { Button } from "react-bootstrap";
import "../../../assets/styles/components/PaginationControls.css";

const PaginationControls = ({
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handlePageClick = (n) => setCurrentPage(n);

  const getDisplayPages = () => {
    const pages = [];
    const windowSize = 1; // number of neighbors to show around currentPage
  
    // Always include first and last
    pages.push(1);
  
    // Calculate window range
    let start = Math.max(2, currentPage - windowSize);
    let end = Math.min(totalPages - 1, currentPage + windowSize);
  
    // Adjust if near the start
    if (currentPage <= windowSize + 2) {
      start = 2;
      end = Math.min(totalPages - 1, 2 * windowSize + 2);
    }
  
    // Adjust if near the end
    if (currentPage >= totalPages - (windowSize + 1)) {
      start = Math.max(2, totalPages - (2 * windowSize + 1));
      end = totalPages - 1;
    }
  
    // Add range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  
    // Always include last if >1
    if (totalPages > 1) {
      pages.push(totalPages);
    }
  
    return pages;
  };
  
  const pages = getDisplayPages();

  return (
    <div className="pagination-controls">
      <Button className="prev-btn" onClick={handlePrev} disabled={currentPage === 1}>
        ← Prev
      </Button>

      {pages.map((page, idx) => {
        const prev = pages[idx - 1];
        const needsEllipsis = idx > 0 && page - prev > 1;

        return (
          <Fragment key={page}>
            {needsEllipsis && <span className="ellipsis" aria-hidden>…</span>}
            <Button
              onClick={() => handlePageClick(page)}
              className={`page-buttons ${currentPage === page ? "current-page-btn" : ""}`}
              aria-current={currentPage === page ? "page" : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </Button>
          </Fragment>
        );
      })}

      <Button className="next-btn" onClick={handleNext} disabled={currentPage === totalPages}>
        Next →
      </Button>
    </div>
  );
};

export default PaginationControls;

