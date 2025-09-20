import React from "react";
import Modal from "../general/Modal";
import PDFPreview from "./PDFPreview";

const PDFPreviewModal = ({ show, filePath, onClose }) => (
  <Modal
    show={show}
    header="PDF Preview"
    content={
      <div>
        <PDFPreview filePath={filePath} isVisible={show} />
      </div>
    }
    handleCloseModal={onClose}
  />
);

export default PDFPreviewModal;
