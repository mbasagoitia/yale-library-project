import { Modal, Button, Form } from "react-bootstrap";

const MoveModal = ({ show, item, destination, onBrowse, onMove, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header className="modal-header d-flex flex-column p-4" closeButton closeVariant="white">
        <h1 className="order-2">Move “{item?.name}”</h1>
      </Modal.Header>

      <Modal.Body>
        <p>Choose destination folder:</p>
        <div className="d-flex gap-2 align-items-center">
          <Form.Control
            type="text"
            value={destination}
            readOnly
            placeholder="No folder selected"
          />
          <Button variant="outline-primary" onClick={onBrowse}>
            Browse…
          </Button>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onMove} disabled={!destination}>
          Move
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MoveModal;
