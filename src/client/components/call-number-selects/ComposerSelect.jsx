import { useState, useEffect } from "react";
import ComposerFilter from "../ComposerFilter";
import AddComposer from "../AddComposer";

const ComposerSelect = ({ mainInfo, setMainInfo }) => {

    const [composerList, setComposerList] = useState([]);
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

    useEffect(() => {
        fetch("http://localhost:5000/api/composer-data", {
            credentials: "include"
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response error");
            }
            return res.json();
        })
        .then((data) => {
            setComposerList(data);
        })
        .catch((error) => {
            console.error("Fetch error:", error);
        });
    }, []);
    
    
    const onItemClick = (item) => {
        setMainInfo({ ...mainInfo, composer: item });
    }

    return (
        <div className="composer-select-area d-flex flex-column">
        {!isModalOpen ? (
        <>
        <ComposerFilter items={composerList} onItemClick={onItemClick} />
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