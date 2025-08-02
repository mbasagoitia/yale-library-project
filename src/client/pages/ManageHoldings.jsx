import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { ModeContext } from "../contexts/ModeContext.js";
import { addHolding } from "../../redux/librarySlice.js";
import updatePiece from "../helpers/holdings/updatePiece.js";
import deletePiece from "../helpers/holdings/deletePiece.js";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useSelector } from 'react-redux';
import CatalogueNew from "../components/holdings/CatalogueNew.jsx";
import catalogueNew from "../helpers/holdings/catalogueNew.js";
import HoldingsList from "../components/holdings/HoldingsList";
import HoldingsFilter from "../components/search-filters/HoldingsFilter";

const ManageHoldings = () => {

    // Page mode (edit vs new): state/useContext
    // Filter behavior: props

    // Every time form is submitted, set back to "new"
    // Add option to change back to "new" mode if nothing is submitted
    // Add delete button
    // Move buttons to this component instead of AdditionalInfo???

    // Remember to add admin access where needed
    const { isAdmin } = useSelector((state) => state.auth);

// This is used to get initial data when editing a piece. May not live on this component
// Where should id come from?
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/holdings-data/${id}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const [mode, setMode] = useState("new")

    const [filteredItems, setFilteredItems] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const holdingsData = useSelector(state => state.library.holdings);

    const dispatch = useDispatch();

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
          await deletePiece(id);
          // Reset form
        } catch (error) {
          console.error('Catalogue error:', error);
        }
      };

    const handleSubmit = async (formData) => {
        try {
          const newPiece = await catalogueNew(formData);
          dispatch(addHolding(newPiece));
        } catch (err) {
          console.error("Error adding holding:", err);
        }
      };

    return (
        <ModeContext.Provider value={{ mode, setMode }}>
            <div className="manage-holdings">
                <h1>Manage Holdings</h1>
                <Container fluid className="mt-4 m-0 p-0">
                    <Row className="d-flex justify-content-evenly">
                        <Col xl={7} className="mb-4 mb-xl-0">
                            <Card>
                                <Card.Header>
                                    <h5 className="mb-0">{`${mode == "new" ? "Add New" : "Edit"} Piece`}</h5>
                                </Card.Header>
                                <Card.Body>
                                    <CatalogueNew submit={handleSubmit} />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={5}>
                            <Card>
                                <Card.Header>
                                    <h5 className="mb-0">Modify Existing Holdings</h5>
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
        </ModeContext.Provider>
    );
};

export default ManageHoldings;
