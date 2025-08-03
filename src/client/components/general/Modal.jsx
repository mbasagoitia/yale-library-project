import { Modal as BootstrapModal } from 'react-bootstrap';

const Modal = ({ show, header, content, handleCloseModal }) => {
  return (
    <BootstrapModal show={show} onHide={handleCloseModal} centered dialogClassName="modal-width">
      <BootstrapModal.Header className="modal-header p-4" closeButton closeVariant="white">
        <h1>{header}</h1>
      </BootstrapModal.Header>
      <BootstrapModal.Body className="modal-body">
        {content}
      </BootstrapModal.Body>
    </BootstrapModal>
  );
};

export default Modal;
