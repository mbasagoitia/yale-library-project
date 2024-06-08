import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MediumSelect from './call-number-selects/MediumSelect';
import ComposerSelect from "./call-number-selects/ComposerSelect";
import SpeciesSelect from "./call-number-selects/SpeciesSelect";
import PublisherSelect from "./call-number-selects/PublisherSelect";
import OpusAndNumber from "./call-number-selects/OpusAndNumber";
import medium from "../classifications/medium";

const CallNumber = ({ callNumber, setCallNumber, title, setTitle }) => {

  const [submitted, setSubmitted] = useState(false);
  const [mediumType, setMediumType] = useState("00");
  const [cutterNumber, setCutterNumber] = useState("");
  const [species, setSpecies] = useState("");
  const [publisher, setPublisher] = useState("");
  const [opus, setOpus] = useState("");
  const [number, setNumber] = useState("");

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Reset nested dropdowns whenever the first menu changes
  }, [medium]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (title && mediumType && cutterNumber && species && publisher) {
      if (true) {
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
    } else {
      setFormErrors({ notes: "Please fill out all required fields." });
      console.log(formErrors);
    }
  }

  return (
    <Container>
      <h1>New Piece Information</h1>
        <Row className="mt-4">
          <Col md={8} className="mb-3">
            <Form.Group controlId="titleInput">
              <Form.Label>Title:</Form.Label>
              <Form.Control 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </Form.Group>
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
        <Button onClick={(e) => handleSubmit(e)} className="btn btn-primary my-2">Generate Call Number</Button>
        <div className={`${formErrors.notes ? "feedback" : "d-none"}`}>{formErrors.notes}</div>
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
