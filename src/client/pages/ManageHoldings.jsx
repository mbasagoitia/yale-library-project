import { useState, useEffect } from "react";
import CatalogueNew from "../components/holdings/CatalogueNew.jsx";
import catalogueNew from "../helpers/holdings/catalogueNew.js";
import Modal from "../components/general/Modal.jsx";


const ManageHoldings = () => {

    useEffect(() => {
        document.addEventListener("keydown", handleEscKeyPress);
        return () => {
            document.removeEventListener("keydown", handleEscKeyPress);
        };
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleEscKeyPress = (e) => {
        if (e.key === "Escape") {
            setIsModalOpen(false);
        }
    };

    return (
        <div className="addNew">
        {!isModalOpen ? (
            <button className="btn btn-primary" onClick={handleOpenModal}>+</button>
        ) : (
            <Modal content={<CatalogueNew mode={"new"} onSubmit={catalogueNew} handleCloseModal={handleCloseModal} />} handleCloseModal={handleCloseModal} />
        )}
    </div>
    )
}

export default ManageHoldings;