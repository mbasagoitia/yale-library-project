import { useState } from "react";
import CatalogueNew from "../components/CatalogueNew";


const Home = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    }

    return (
        <div className="home">
            <h1>Yale Philharmonia Library</h1>
            <div className="search-library">
                Browse Our Collection
            </div>
            <div className="addNew">
                {!isModalOpen ? (
                    <button onClick={(e) => handleOpenModal(e)}>Add New Piece</button>
                ) : <div className="modal-overlay">
                        {/* <div className="modal"> */}
                            <div className="modal-content">
                                <CatalogueNew />
                            </div>
                        {/* </div> */}
                    </div>
                }

            </div>
        </div>
    )
}

export default Home;