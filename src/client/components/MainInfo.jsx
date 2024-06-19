import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MediumSelect from './call-number-selects/MediumSelect';
import ComposerSelect from "./call-number-selects/ComposerSelect";
import SpeciesSelect from "./call-number-selects/SpeciesSelect";
import PublisherSelect from "./call-number-selects/PublisherSelect";
import OpusAndNumber from "./call-number-selects/OpusAndNumber";
import medium from "../classifications/medium";

const MainInfo = ({ mainInfo, setMainInfo, formErrors }) => {

  useEffect(() => {
    // Reset nested dropdowns whenever the first menu changes
  }, [mainInfo.medium]);

  return (
    <Container>
        <Row className="mt-4">
        <div id="required-fields-warning" className={`${formErrors.requiredFieldsWarning ? "feedback my-2" : "d-none"}`}>{formErrors.requiredFieldsWarning}</div>
          <Col md={8}>
            <Form.Group controlId="titleInput">
              <Form.Label>Title:</Form.Label>
              <Form.Control 
                type="text" 
                value={mainInfo.title} 
                onChange={(e) => setMainInfo({ ...mainInfo, title: e.target.value })} 
              />
            </Form.Group>
          </Col>
          <OpusAndNumber mainInfo={mainInfo} setMainInfo={setMainInfo} />
        </Row>
        <Row className="mt-4">
        <div id="required-call-fields-warning" className={`${formErrors.requiredCallFieldsWarning ? "feedback my-2" : "d-none"}`}>{formErrors.requiredCallFieldsWarning}</div>
          <Col xs={12} md={6}>
            <div className="mb-3">
              <h3>Ensemble Type</h3>
              <MediumSelect items={medium} mainInfo={mainInfo} setMainInfo={setMainInfo} />
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="mb-3">
              <h3>Composer</h3>
              <ComposerSelect mainInfo={mainInfo} setMainInfo={setMainInfo} />
            </div>
          </Col>
        </Row>
        <Row className="mt-xs-0 mt-md-4">
          <Col xs={12} md={6}>
            <div className="mb-3">
              <h3>Genre</h3>
              <SpeciesSelect mainInfo={mainInfo} setMainInfo={setMainInfo} />
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="mb-3">
              <h3>Publisher</h3>
              <PublisherSelect mainInfo={mainInfo} setMainInfo={setMainInfo} />
            </div>
          </Col>
        </Row>
    </Container>
  );
};

export default MainInfo;
