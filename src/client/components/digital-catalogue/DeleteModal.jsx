import React from "react";
import Modal from "../general/Modal";
import { Button } from "react-bootstrap";

const DeleteModal = ({ show, item, onDelete, onClose }) => (
  <Modal
    show={show}
    header="Delete from Digital Catalogue"
    content={
      <div className="d-flex flex-column align-items-center">
        <div className="text-center mb-4">
          Are you sure you want to remove <strong>{item?.name}</strong> from the catalogue?  
          This action cannot be undone.
        </div>
        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    }
    handleCloseModal={onClose}
  />
);

export default DeleteModal;
