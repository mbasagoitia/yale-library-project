import { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import CatalogueNew from "../components/holdings/CatalogueNew.jsx";
import catalogueNew from "../helpers/holdings/catalogueNew.js";
import fetchHoldings from "../helpers/holdings/fetchHoldings";
import HoldingsList from "../components/holdings/HoldingsList";
import HoldingsFilter from "../components/search-filters/HoldingsFilter";

const ManageHoldings = () => {
    const [holdingsData, setHoldingsData] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchHoldings();
                setHoldingsData(data);
                if (isInitialLoad) {
                    setFilteredItems(data);
                    setIsInitialLoad(false);
                }
            } catch (error) {
                console.error("Failed to fetch holdings data:", error);
            }
        };

        fetchData();
    }, [isInitialLoad]);

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
                                <CatalogueNew mode="new" onSubmit={catalogueNew} />
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
                                />
                                <hr />
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
