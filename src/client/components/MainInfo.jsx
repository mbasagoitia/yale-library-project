import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MediumSelect from './call-number-selects/MediumSelect';
import ComposerSelect from "./call-number-selects/ComposerSelect";
import SpeciesSelect from "./call-number-selects/SpeciesSelect";
import PublisherSelect from "./call-number-selects/PublisherSelect";
import IdAndNumber from "./call-number-selects/IdAndNumber";

const MainInfo = ({ resourceData, mainInfo, setMainInfo, formErrors }) => {

  return (
    <Container>
        <Row className="mt-4">
        <div id="required-fields-warning" className={`${formErrors.requiredFieldsWarning ? "feedback my-2" : "d-none"}`}>{formErrors.requiredFieldsWarning}</div>
          <Col md={6}>
            <Form.Group controlId="titleInput">
              <Form.Label>Title:</Form.Label>
              <Form.Control 
                type="text" 
                value={mainInfo.title} 
                onChange={(e) => setMainInfo({ ...mainInfo, title: e.target.value })}
                placeholder="e.g. Symphony no. 2 in D major" 
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <IdAndNumber mainInfo={mainInfo} setMainInfo={setMainInfo} />
          </Col>
        </Row>
        <Row className="mt-4">
        <div id="required-call-fields-warning" className={`${formErrors.requiredCallFieldsWarning ? "feedback my-2" : "d-none"}`}>{formErrors.requiredCallFieldsWarning}</div>
          <Col xs={12} md={6}>
            <div className="mb-3">
              <h3>Ensemble Type</h3>
              {resourceData.mediumData.length > 0 && <MediumSelect items={resourceData.mediumData} mainInfo={mainInfo} setMainInfo={setMainInfo} />}
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="mb-3">
              <h3>Composer</h3>
              <ComposerSelect items={resourceData.composerData} mainInfo={mainInfo} setMainInfo={setMainInfo} />
            </div>
          </Col>
        </Row>
        <Row className="mt-xs-0 mt-md-4">
          <Col xs={12} md={6}>
            <div className="mb-3">
              <h3>Genre</h3>
              {resourceData.speciesData.length > 0 && <SpeciesSelect items={resourceData.speciesData} mainInfo={mainInfo} setMainInfo={setMainInfo} />}
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="mb-3">
              <h3>Publisher</h3>
              {resourceData.publisherData.length > 0 && <PublisherSelect items={resourceData.publisherData} mainInfo={mainInfo} setMainInfo={setMainInfo} />}
            </div>
          </Col>
        </Row>
    </Container>
  );
};

export default MainInfo;
