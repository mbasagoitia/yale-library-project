import { Button } from "react-bootstrap";
import "../../../assets/styles/components/PaginationControls.css";

const PaginationControls = ({
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return (
    <div className="pagination-controls">
      <Button onClick={handlePrev} disabled={currentPage === 1}>
        ← Prev
      </Button>

      {Array.from({ length: totalPages }, (_, idx) => (
        <Button
          key={idx + 1}
          onClick={() => handlePageClick(idx + 1)}
          className={`btn-primary ${currentPage === idx + 1 ? "active" : ""} current-page-btn`}
        >
          {idx + 1}
        </Button>
      ))}

      <Button className="btn-primary" onClick={handleNext} disabled={currentPage === totalPages}>
        Next →
      </Button>
    </div>
  );
};

export default PaginationControls;
