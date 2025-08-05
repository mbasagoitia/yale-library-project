import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { ModeContext } from "../contexts/ModeContext.js";
import { addHolding, updateHolding } from "../../redux/librarySlice.js";
import updatePiece from "../helpers/holdings/updatePiece.js";
import { Container, Row, Col, Card } from "react-bootstrap";
import CatalogueNew from "../components/holdings/CatalogueNew.jsx";
import catalogueNew from "../helpers/holdings/catalogueNew.js";
import HoldingsList from "../components/holdings/HoldingsList";
import HoldingsFilter from "../components/search-filters/HoldingsFilter";
import { selectFilteredHoldings } from "../../redux/searchSelectors.js";
import { clearSearch } from "../../redux/searchSlice.js";

const ManageHoldings = () => {

    // Get/set initial form data when editing a piece
    const [data, setData] = useState(null);

    // Is the CataloguePiece interface being used for cataloguing a new piece or updating an existing one?
    const [mode, setMode] = useState("new");

    // Reference CatalogueNew and clear the form, since the logic is defined there
    const catalogeNewRef = useRef();

    const handleSetNewAndClear = () => {
        catalogeNewRef.current?.setNewAndClear();
    }

    // Search results
    const filteredItems = useSelector(selectFilteredHoldings);

    // Show search results (when searching for a piece to edit)
    const [showResults, setShowResults] = useState(false);

    const dispatch = useDispatch();

    const handleAddNewPiece = async (formData) => {
        try {
          // Save to database
          const newPiece = await catalogueNew(formData);
          // Update redux store
          dispatch(addHolding(newPiece));
          // Reset form
          setMode("new");
          setData(null);
        } catch (err) {
          console.error("Error adding holding:", err);
        }
      };

      const handleUpdatePiece = async (formData) => {
        try {
          // Save to database
          const updated = await updatePiece(formData, data?.id);
          // Update redux store
          dispatch(updateHolding(updated));
          // Reset form
          setMode("new");
          setData(null);
          setShowResults(false);
          dispatch(clearSearch())
        } catch (err) {
          console.error("Error updating holding:", err);
        }
      };

    return (
        <ModeContext.Provider value={{ mode, setMode, setData }}>
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
                                    <CatalogueNew ref={catalogeNewRef} handleSubmit={mode == "new" ? handleAddNewPiece : handleUpdatePiece} initialData={data} setShowResults={setShowResults} />
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
