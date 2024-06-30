import { Card, Row, Col } from 'react-bootstrap';

const PieceListItem = ({ data }) => {
    // Data comes in as a single piece with the following properties,
    // some of which are ids for processing purposes and others are titles for display purposes:

    // title, opus, number, composer_id, composer, species_id, genre, medium_id, medium,
    // publisher_id, publisher, condition_id, condition, public_domain, additional_notes,
    // media_type_id, media_type, location_id, location

    // Only title, opus (if present), number (if present AND opus is also present), composer, and publisher should be listed on this list item.
    // Clicking on the list item routes the user to a new page based on the piece's unique id (check how 
    // to format this other than as a number), where the rest of the information will be displayed

    // Listing op. and no. are very rare and are only used in determining the call number if they are significant
    // in the title, or are chamber music. Number alone won't be listed here, only opus alone if significant
    // If both are present, it is assumed that the piece is part of a collection and will be listed as op 18/1

    let { id, title, identifier_label, identifier_value, number, last_name, first_name, publisher } = data;

    if (identifier_value && number) {
        title += ` ${identifier_value}/${number}`;
    } else if (identifier_value) {
        title += ` ${identifier_label} ${identifier_value}`;
    }

    return (
        // This url should eventually be something different
        <a href={`/browse-holdings/${id}`} className="piece-list-item-link">
        <Card className="mb-1 piece-list-item">
            <Card.Body>
                <Row className="align-items-center">
                    <Col xs={0} sm={1} className="empty-col"><div className="empty-tag"></div></Col>
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
        </a>
    );
}

export default PieceListItem;