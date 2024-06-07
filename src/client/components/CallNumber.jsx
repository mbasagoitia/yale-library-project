import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import MediumSelect from './call-number-selects/MediumSelect';
import ComposerSelect from "./call-number-selects/ComposerSelect";
import SpeciesSelect from "./call-number-selects/SpeciesSelect";
import PublisherSelect from "./call-number-selects/PublisherSelect";
import OpusAndNumber from "./call-number-selects/OpusAndNumber";
import medium from "../classifications/medium";
import 'bootstrap/dist/css/bootstrap.min.css';

const CallNumber = ({ callNumber, setCallNumber }) => {
  const [submitted, setSubmitted] = useState(false);
  const [mediumType, setMediumType] = useState("00");
  const [cutterNumber, setCutterNumber] = useState("");
  const [species, setSpecies] = useState("");
  const [publisher, setPublisher] = useState("");
  const [opus, setOpus] = useState("");
  const [number, setNumber] = useState("");

  useEffect(() => {
    // Reset nested dropdowns whenever the first menu changes
  }, [medium]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let speciesTitle = species;
    if (opus && number) {
      speciesTitle += ` ${opus}/${number}`;
    } else if (opus) {
      speciesTitle += ` Op.${opus}`;
    } else if (number) {
      speciesTitle += ` no.${number}`;
    }
    let call = [mediumType, cutterNumber, speciesTitle, publisher];
    setCallNumber(call);
    setSubmitted(true);
  };

  return (
    <Container>
      <h1>New Piece Information</h1>
      <form onSubmit={handleSubmit}>
        <Row className="mt-4">
          <Col md={8} className="mb-3">
            <label htmlFor="titleInput" className="form-label">Title:</label>
            <input type="text" className="form-control" id="titleInput" />
          </Col>
          <OpusAndNumber setOpus={setOpus} setNumber={setNumber} />
        </Row>
        <Row className="mt-4">
          <Col xs={12} md={6}>
            <div className="mb-3">
              <h3>Ensemble Type</h3>
              <MediumSelect items={medium} setMediumType={setMediumType} />
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="mb-3">
              <h3>Composer</h3>
              <ComposerSelect setCutterNumber={setCutterNumber} />
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col xs={12} md={6}>
            <div className="mb-3">
              <h3>Genre</h3>
              <SpeciesSelect setSpecies={setSpecies} />
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="mb-3">
              <h3>Publisher</h3>
              <PublisherSelect setPublisher={setPublisher} />
            </div>
          </Col>
        </Row>
        <button type="submit" className="btn btn-primary my-4">Generate Call Number</button>
      </form>
      {submitted && (
        <div className="alert alert-success d-flex flex-column align-items-center" role="alert">
          <h4>Call Number:</h4>
          <div>
          {callNumber.map((line, index) => (
            <div className="callNumLine" key={index}>{line}</div>
          ))}
          </div>
        </div>
      )}
    </Container>
  );
};

export default CallNumber;
