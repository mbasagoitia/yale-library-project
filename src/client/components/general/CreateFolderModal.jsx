import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CreateFolderModal = ({ show, onClose, onCreate }) => {
  const [folderName, setFolderName] = useState("New Folder");

  const handleSubmit = () => {
    if (folderName.trim()) {
      onCreate(folderName.trim());
      onClose();
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Folder</Modal.Title>
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
        <Button variant="primary" onClick={handleSubmit}>Create</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateFolderModal;
