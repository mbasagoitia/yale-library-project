import { useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { ModeContext } from "../contexts/ModeContext.js";
import { Container, Row, Col, Card } from "react-bootstrap";

import HoldingsList from "../components/holdings/HoldingsList";
import HoldingsFilter from "../components/search-filters/HoldingsFilter";
import { selectFilteredHoldings } from "../../redux/searchSelectors.js";
import CatalogueForm from "../components/holdings/CatalogueForm.jsx";

import ManageDigitalCatalogue from "../components/digital-catalogue/ManageDigitalCatalogue.jsx";

import "../../assets/styles/pages/ManageHoldingsPage.css";

const ManageHoldings = () => {

    // Is the CataloguePiece interface being used for cataloguing a new piece or updating an existing one?
    const [mode, setMode] = useState("new");

    // Get/set initial form data when editing a piece
    const [data, setData] = useState(null);

    // Reference CatalogueForm and clear the form, since the logic is defined there
    const catalogueFormRef = useRef();

    const handleSetNewAndClear = () => {
        setMode("new");
        // Calling the callback function from the child component to reset the form
        catalogueFormRef.current?.resetForm();
      };

    // Search results, if any; otherwise entire holdings list
    const filteredItems = useSelector(selectFilteredHoldings);

    // Show search results (when searching for a piece to edit)
    const [showResults, setShowResults] = useState(false);

    // Used to reset the MediumSelect component, which is used several times in nested child components
    const [mediumResetKey, setMediumResetKey] = useState(0);

    return (
        <ModeContext.Provider value={{ mode, setMode, setData, mediumResetKey, setMediumResetKey }}>
            <div className="manage-holdings">
                <h1>Manage Holdings</h1>
                <Container fluid className="mt-4 m-0 p-0">
                    <Row className="d-flex justify-content-evenly">
                        <Col xl={7} className="mb-4 mb-xl-0">
                            <Card>
                                <Card.Header>
                                    {mode === "new" ? (
                                    <h5 className="mb-0">Add New Piece</h5>
                                    ): 
                                    (
                                    <h5 className="mb-0">Editing <em>{data?.title}</em> | <span onClick={handleSetNewAndClear}>Add New Piece</span></h5>
                                    )}

                                </Card.Header>
                                <Card.Body>
                                    <CatalogueForm ref={catalogueFormRef} initialData={data} />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={5}>
                            <Card>
                                 <Card.Header>
                                    <h5 className="mb-0">Manage Digital Catalogue</h5>
                                </Card.Header>
                                <Card.Body>
                                    <ManageDigitalCatalogue />
                                </Card.Body>
                            </Card>
                            <Card>
                                <Card.Header>
                                    <h5 className="mb-0">Edit Existing Holdings</h5>
                                </Card.Header>
                                <Card.Body>
                                    <HoldingsFilter setShowResults={setShowResults}/>
                                    <hr />
                                    {showResults ? <h2 className="mt-2 mb-3">Results: {filteredItems.length}</h2> : null}
                                    <HoldingsList filteredItems={filteredItems} behavior={"edit"} />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </ModeContext.Provider>
    );
};

export default ManageHoldings;
