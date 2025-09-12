import React, { Fragment } from "react";
import { Button } from "react-bootstrap";
import "../../../assets/styles/components/PaginationControls.css";

const PaginationControls = ({
  currentPage,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const changePage = (page) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    onPageChange(clamped);
  };

  const handleNext = () => changePage(currentPage + 1);
  const handlePrev = () => changePage(currentPage - 1);

  const getDisplayPages = () => {
    const pages = [];
    const windowSize = 1;

    pages.push(1);

    let start = Math.max(2, currentPage - windowSize);
    let end = Math.min(totalPages - 1, currentPage + windowSize);

    if (currentPage <= windowSize + 2) {
      start = 2;
      end = Math.min(totalPages - 1, 2 * windowSize + 2);
    }

    if (currentPage >= totalPages - (windowSize + 1)) {
      start = Math.max(2, totalPages - (2 * windowSize + 1));
      end = totalPages - 1;
    }

    for (let i = start; i <= end; i++) pages.push(i);
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = getDisplayPages();

  return (
    <div className="pagination-controls">
      <Button
        className="prev-btn"
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        ← Prev
      </Button>

      {pages.map((page, idx) => {
        const prev = pages[idx - 1];
        const needsEllipsis = idx > 0 && page - prev > 1;

        return (
          <Fragment key={page}>
            {needsEllipsis && <span className="ellipsis" aria-hidden>…</span>}
            <Button
              onClick={() => changePage(page)}
              className={`page-buttons ${
                currentPage === page ? "current-page-btn" : ""
              }`}
              aria-current={currentPage === page ? "page" : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </Button>
          </Fragment>
        );
      })}

      <Button
        className="next-btn"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next →
      </Button>
    </div>
  );
};

export default PaginationControls;
