import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CreateFolderModal = ({ show, onClose, onCreate }) => {
  const [folderName, setFolderName] = useState("");

  const handleSubmit = () => {
    if (folderName.trim()) {
      onCreate(folderName.trim());
      onClose();
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header className="modal-header d-flex flex-column p-4" closeButton closeVariant="white">
        <h1 className="order-2">Create Folder</h1>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Enter folder name"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!folderName}>Create</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateFolderModal;
