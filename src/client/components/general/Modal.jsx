const Modal = ({ content, handleCloseModal }) => {
    return (
        <div className="modal-overlay">
            <div className="popup">
                <span className="close-button" onClick={handleCloseModal}>×</span>
                <div className="modal-content">
                {content}
                </div>
            </div>
        </div>
    )
}

export default Modal;