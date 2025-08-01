import { useState, useEffect } from "react";
import ComposerFilter from "../../search-filters/ComposerFilter";
import AddComposer from "../../holdings/AddComposer";
import Modal from "../../general/Modal";

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
        document.addEventListener("keydown", handleEscKeyPress);
        return () => {
            document.removeEventListener("keydown", handleEscKeyPress);
        };
    }, []);  

    return (
        <div className="composer-select-area d-flex flex-column">
        <ComposerFilter initialValue={mainInfo?.composer?.id ? `${mainInfo.composer.last_name}, ${mainInfo.composer.first_name}` : ''} items={items} onItemClick={onItemClick} />
        <span onClick={handleOpenModal} className="new-composer-open mt-2">Don't see composer?</span>
        <Modal show={isModalOpen} header={"Add Composer"} handleCloseModal={handleCloseModal} content={<AddComposer handleCloseModal={handleCloseModal} />}/>
        </div>
    )
}

export default ComposerSelect;