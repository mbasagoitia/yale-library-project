import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MediumSelect from './call-number-selects/MediumSelect';
import ComposerSelect from "./call-number-selects/ComposerSelect";
import SpeciesSelect from "./call-number-selects/SpeciesSelect";
import PublisherSelect from "./call-number-selects/PublisherSelect";
import OpusAndNumber from "./call-number-selects/OpusAndNumber";
import medium from "../classifications/medium";
import fetchResourceData from "../helpers/fetchResourceData";
import organizeData from "../helpers/organizeData";

const MainInfo = ({ mainInfo, setMainInfo, formErrors }) => {

  const [resourceData, setResourceData] = useState({
    mediumData: [],
    speciesData: [],
    publisherData: [],
  });

  const organizedItems = organizeData(resourceData.mediumData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resources = await fetchResourceData();
        setResourceData({ 
          mediumData: resources[0],
          speciesData: resources[1],
          publisherData: resources[2]
         });
      } catch (error) {
        console.error("Error fetching resource data:", error);
      }
    }
    fetchData();
  }, [])
  
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
              {resourceData.mediumData.length > 0 && <MediumSelect items={organizedItems} mainInfo={mainInfo} setMainInfo={setMainInfo} />}
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
