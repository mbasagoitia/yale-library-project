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

    // Dummy data for testing and styling purposes

    const renderOpusAndNumber = () => {
        if (opus && number) {
            return <span>Op./No. {opus}/{number}</span>;
        } else if (opus) {
            return <span>Op. {opus}</span>;
        }
        return null;
    };

    const { title, opus, number, composer, publisher } = data;

    return (
        <Card className="mb-1 piece-list-item">
            <Card.Body>
                <Row className="align-items-center">
                    <Col xs={1} className="empty-col"><div className="empty-tag"></div></Col>
                    <Col xs={4} className='d-flex op-col'>
                        <p className="mb-0">{title}</p>
                        {renderOpusAndNumber() && <>{renderOpusAndNumber()}</>}
                    </Col>
                    <Col xs={4}>
                        <p className="mb-0 text-muted">{`${composer.last_name}, ${composer.first_name}`}</p>
                    </Col>
                    <Col xs={3}>
                        <div>
                            {publisher && <div>{publisher.label}</div>}
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default PieceListItem;