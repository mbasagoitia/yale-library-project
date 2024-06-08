import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import CatalogueNew from "../components/CatalogueNew";

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleOutsideClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            setIsModalOpen(false);
        }
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
        <div className="home">
            <header className="App-header">
                <h1>Yale Philharmonia Library</h1>
            </header>
            <div className="search-library">
                Browse Our Collection
            </div>
            <div className="addNew">
                {!isModalOpen ? (
                    <button className="btn btn-primary" onClick={handleOpenModal}>Add New Piece</button>
                ) : (
                    <div className="modal-overlay" onClick={handleOutsideClick}>
                        <div className="popup">
                            <span className="close-button" onClick={handleCloseModal}>×</span>
                                <div className="modal-content">
                                <CatalogueNew />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
