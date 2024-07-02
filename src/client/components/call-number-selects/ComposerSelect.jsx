import { useState, useEffect } from "react";
import ComposerFilter from "../ComposerFilter";
import AddComposer from "../AddComposer";

const ComposerSelect = ({ items, mainInfo, onItemClick }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleEscKeyPress = (e) => {
        if (e.key === "Escape") {
            e.stopPropagation()
            setIsModalOpen(false);
        }
    };

    useEffect(() => {
        // Add listener to something other than the document to prevent propagation?
        document.addEventListener("keydown", handleEscKeyPress);
        return () => {
            document.removeEventListener("keydown", handleEscKeyPress);
        };
    }, []);  

    return (
        <div className="composer-select-area d-flex flex-column">
        {!isModalOpen ? (
        <>
        <ComposerFilter initialValue={mainInfo?.composer?.id ? `${mainInfo.composer.last_name}, ${mainInfo.composer.first_name}` : ''} items={items} onItemClick={onItemClick} />
        <span onClick={handleOpenModal} className="new-composer-open mt-2">Don't see composer?</span>
        </>
        ) : (
            <div className="modal-overlay">
                <div className="popup">
                    <span className="close-button" onClick={handleCloseModal}>×</span>
                    <div className="modal-content">
                        <AddComposer handleCloseModal={handleCloseModal} />
                    </div>
                </div>
            </div>
        )}
        </div>
    )
}

export default ComposerSelect;