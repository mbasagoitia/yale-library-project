import { useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { ModeContext } from "../contexts/ModeContext.js";
import { Container, Row, Col, Card } from "react-bootstrap";

import HoldingsList from "../components/holdings/HoldingsList";
import HoldingsFilter from "../components/search-filters/HoldingsFilter";
import { selectFilteredHoldings } from "../../redux/searchSelectors.js";
import CatalogueNew from "../components/holdings/CatalogueNew.jsx";

const ManageHoldings = () => {

    // Get/set initial form data when editing a piece
    const [data, setData] = useState(null);

    // Is the CataloguePiece interface being used for cataloguing a new piece or updating an existing one?
    const [mode, setMode] = useState("new");

    // Reference CatalogueNew and clear the form, since the logic is defined there
    const catalogeNewRef = useRef();

    const handleSetNewAndClear = () => {
        // Calling the callback function from the child component to reset the form
        catalogeNewRef.current?.resetForm();
      };

    // Search results
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
                                    <CatalogueNew ref={catalogeNewRef} onResetForm={handleSetNewAndClear} initialData={data} setData={setData} setShowResults={setShowResults} />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={5}>
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
