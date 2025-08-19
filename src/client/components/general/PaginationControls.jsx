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
    if (totalPages <= 4) return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (currentPage <= 2) {
      return [1, 2, 3, totalPages];
    }
    if (currentPage >= totalPages - 1) {
      return [1, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, currentPage - 1, currentPage, totalPages];
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

