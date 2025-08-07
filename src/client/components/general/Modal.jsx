import { Modal as BootstrapModal } from 'react-bootstrap';

const Modal = ({ show, header, content, handleCloseModal }) => {
  return (
    <BootstrapModal show={show} onHide={handleCloseModal} centered dialogClassName="modal-width">
      <BootstrapModal.Header className="modal-header d-flex flex-column p-4" closeButton closeVariant="white">
        <h1 className="order-2 mt-2">{header}</h1>
      </BootstrapModal.Header>
      <BootstrapModal.Body className="modal-body w-100">
        {content}
      </BootstrapModal.Body>
    </BootstrapModal>
  );
};

export default Modal;
