import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { addHolding } from "../../redux/librarySlice.js";
import { Container, Row, Col, Card } from "react-bootstrap";
import CatalogueNew from "../components/holdings/CatalogueNew.jsx";
import catalogueNew from "../helpers/holdings/catalogueNew.js";
import HoldingsList from "../components/holdings/HoldingsList";
import HoldingsFilter from "../components/search-filters/HoldingsFilter";

const ManageHoldings = () => {

    const [filteredItems, setFilteredItems] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const holdingsData = useSelector(state => state.library.holdings);

    const dispatch = useDispatch();

    const handleSubmit = async (formData) => {
        try {
          const newPiece = await catalogueNew(formData);
          dispatch(addHolding(newPiece));
        } catch (err) {
          console.error("Error adding holding:", err);
        }
      };

    return (
        <div className="manage-holdings">
            <h1>Manage Holdings</h1>
            <Container fluid className="mt-4 m-0 p-0">
                <Row className="d-flex justify-content-evenly">
                    <Col xl={7} className="mb-4 mb-xl-0">
                        <Card>
                            <Card.Header>
                                <h5 className="mb-0">Add New Piece</h5>
                            </Card.Header>
                            <Card.Body>
                                <CatalogueNew mode="new" submit={handleSubmit} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xl={5}>
                        <Card>
                            <Card.Header>
                                <h5 className="mb-0">Search Collection</h5>
                            </Card.Header>
                            <Card.Body>
                                <HoldingsFilter
                                    holdingsData={holdingsData}
                                    setFilteredItems={setFilteredItems}
                                    setShowResults={setShowResults}
                                />
                                <hr />
                                {showResults ? <h2 className="mt-2 mb-3">Results: {filteredItems.length}</h2> : null}
                                <HoldingsList filteredItems={filteredItems} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ManageHoldings;
