import { Card, Row, Col } from 'react-bootstrap';
import { useMode } from "../../contexts/ModeContext.js";
import { useNavigate } from 'react-router-dom';

const PieceListItem = ({ data, behavior }) => {
    // console.log(data);            
    // Data comes in as a single piece with the following properties,
    // some of which are ids for processing purposes and others are titles for display purposes:

    // title, opus, number, composer_id, composer, species_id, genre, medium_id, medium,
    // publisher_id, publisher, condition_id, condition, public_domain, additional_notes,
    // media_type_id, media_type, location_id, location

    // Only title, opus (if present), number (if present AND opus is also present), composer, and publisher should be listed on this list item.
    // Based on desired behavior, clicking on the list item either routes the user to a new page based on the piece's unique id or populates the 
    // "edit piece" interface with current data

    // Listing both op. and no. are very rare and are only used in determining the call number if they are significant
    // in the title, or are chamber music. Number alone won't be listed here, only opus alone if significant.
    // If both are present, it is assumed that the piece is part of a collection and will be listed as op. 18/1

    let { id, title, identifier_label, identifier_value, number, last_name, first_name, publisher } = data;

    if (identifier_value && number) {
        title += ` ${identifier_value}/${number}`;
    } else if (identifier_value) {
        title += ` ${identifier_label} ${identifier_value}`;
    }

    // Sets initial piece data on manage holdings page
    const { setMode, setData, setMediumResetKey, catalogueFormRef } = useMode();

    // Navigates to single piece page
    const navigate = useNavigate();

    return (
        <Card
            className="mb-1 piece-list-item"
            onClick={() => {
                if (behavior === "edit") {
                    catalogueFormRef.current?.resetForm();
                    // Trigger reset of the medium dropdown component
                    setMediumResetKey(prev => prev + 1)
                    // Set initial data from this component
                    setData(data);
                    // If a user clicks on this item, the mode should be set to edit instead of new
                    setMode("edit");
                } else {
                navigate(`/browse-holdings/${id}`);
                }
            }}
        >
            <Card.Body>
                <Row className="align-items-center">
                    <Col xs={0} sm={1} className="empty-col">
                        <div className="empty-tag"></div>
                    </Col>
                    <Col xs={5} sm={4} className='d-flex op-col'>
                        <p className="mb-0">{title}</p>
                    </Col>
                    <Col xs={4}>
                        <p className="mb-0 text-muted">{`${last_name}, ${first_name}`}</p>
                    </Col>
                    <Col xs={3}>
                        <div>
                            {publisher && <div>{publisher}</div>}
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default PieceListItem;