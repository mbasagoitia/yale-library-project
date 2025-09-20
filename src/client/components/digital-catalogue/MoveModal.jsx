import React from "react";
import Modal from "../general/Modal";
import { Button } from "react-bootstrap";

const MoveModal = ({ show, item, destination, onBrowse, onMove, onClose }) => (
  <Modal
    show={show}
    header={`Move "${item?.name}"`}
    content={
      <div>
        <p>Choose destination folder:</p>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            value={destination}
            readOnly
            placeholder="No folder selected"
          />
          <Button variant="outline-primary" onClick={onBrowse}>
            Browse...
          </Button>
        </div>
      </div>
    }
    handleCloseModal={onClose}
    footer={
      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onMove} disabled={!destination}>
          Move
        </Button>
      </div>
    }
  />
);

export default MoveModal;
