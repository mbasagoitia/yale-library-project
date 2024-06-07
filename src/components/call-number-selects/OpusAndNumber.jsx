import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

const OpusAndNumber = ({ setOpus, setNumber }) => {
  const [opusValue, setOpusValue] = useState("");
  const [numberValue, setNumberValue] = useState("");

  const handleOpusChange = (e) => {
    setOpusValue(e.target.value);
    setOpus(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNumberValue(e.target.value);
    setNumber(e.target.value);
  };

  return (
    <>
        <Col md={2}>
          <label htmlFor="opusInput" className="form-label">Opus:</label>
          <input
            type="number"
            className="form-control"
            id="opusInput"
            value={opusValue}
            onChange={handleOpusChange}
          />
        </Col>
        <Col md={2}>
          <label htmlFor="numberInput" className="form-label">Number:</label>
          <input
            type="number"
            className="form-control"
            id="numberInput"
            value={numberValue}
            onChange={handleNumberChange}
          />
        </Col>
    </>
  );
};

export default OpusAndNumber;
