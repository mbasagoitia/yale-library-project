import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import CatalogueNew from "../components/CatalogueNew";
import updatePiece from "../helpers/updatePiece.js";

const PieceInfo = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/holdings-data/${id}`);
        const data = await res.json();
        setData(data[0]);
        console.log(data[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleEscKeyPress = (e) => {
        if (e.key === "Escape") {
            setIsModalOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleEscKeyPress);
        return () => {
            document.removeEventListener("keydown", handleEscKeyPress);
        };
    }, []);

  const renderIdAndNumber = () => {
    if (data?.identifier_value && data?.number) {
      return <span>{data.identifier_value}/{data.number}</span>;
    } else if (data?.identifier_value) {
      return <span>{data.identifier_label} {data.identifier_value}</span>;
    }
    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
  
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <Container>
        {data && (
          <>
            <h1 className="mb-4">{data.title} {renderIdAndNumber()}</h1>
            {!isModalOpen ? (
            <span onClick={handleOpenModal} className="edit-text">Edit</span>
        ) : (
            <div className="modal-overlay">
                <div className="popup">
                    <span className="close-button" onClick={handleCloseModal}>×</span>
                        <div className="modal-content">
                        <CatalogueNew mode={"edit"} initialData={data} onSubmit={updatePiece} />
                    </div>
                </div>
            </div>
        )}
            <Row className="mb-3">
              <Col sm={6}>
                <p className="lead mb-0">{`${data.first_name} ${data.last_name}`}</p>
              </Col>
              <Col sm={6}>
                <p><strong>Publisher:</strong> <span className="text-muted">{data.publisher}</span></p>
                <p><strong>Acquisition Date:</strong> <span className="text-muted">{data.acquisition_date? formatDate(data.acquisition_date) : "Unknown"}</span></p>
                <p><strong>Call Number:</strong> <span className="text-muted">{data.call_number}</span></p>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={6}>
                <p><strong>Public Domain:</strong> <span className="text-muted">{data.public_domain ? "Yes" : "No"}</span></p>
                <p><strong>String Scans:</strong> <span className="text-muted">{data.own_digital ? "Yes" : "No"}</span></p>
                {data.own_digital && <a href={data.scans_url} target="_blank" rel="noreferrer">Link to digital scans</a>}
              </Col>
              <Col sm={6}>
                <p><strong>Condition:</strong> <span className="text-muted">{data.condition}</span></p>
              </Col>
            </Row>
            {data.additional_notes && (
              <div className="mb-3">
                <p><strong>Additional Notes:</strong> {data.additional_notes}</p>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default PieceInfo;
