import { useState, useEffect } from "react";
import CatalogueNew from "../components/CatalogueNew";
import catalogueNew from "../helpers/catalogueNew.js";


const ManageHoldings = () => {

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

    useEffect(() => {
        document.addEventListener("keydown", handleEscKeyPress);
        return () => {
            document.removeEventListener("keydown", handleEscKeyPress);
        };
    }, []);

    return (
        <div className="addNew">
        {!isModalOpen ? (
            <button className="btn btn-primary" onClick={handleOpenModal}>+</button>
        ) : (
            <div className="modal-overlay">
                <div className="popup">
                    <span className="close-button" onClick={handleCloseModal}>×</span>
                        <div className="modal-content">
                        <CatalogueNew onSubmit={catalogueNew} />
                    </div>
                </div>
            </div>
        )}
    </div>
    )
}

export default ManageHoldings;