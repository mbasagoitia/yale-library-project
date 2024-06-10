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
                <div className="header-content">
                <div className="yale-header-tag">Yale University</div>
                <hr></hr>
                <h1>Philharmonia Library</h1>
                </div>
            </header>
            <div className="search-library">
                Browse Our Collection
            </div>
            <div className="addNew">
                {!isModalOpen ? (
                    <button className="btn btn-primary" onClick={handleOpenModal}>Add New Piece</button>
                ) : (
                    <div className="modal-overlay">
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
