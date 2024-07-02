import { Container, Row, Col, Form } from "react-bootstrap";
import MediumSelect from './call-number-selects/MediumSelect';
import ComposerSelect from "./call-number-selects/ComposerSelect";
import SpeciesSelect from "./call-number-selects/SpeciesSelect";
import PublisherSelect from "./call-number-selects/PublisherSelect";
import IdAndNumber from "./call-number-selects/IdAndNumber";

const MainInfo = ({ resourceData, mainInfo, setMainInfo, formErrors }) => {

  // The onItemClick methods passed to each select/filter to set main info.
  // The behavior should be different when they are accessed from the browse holdings filter.

  const setMedium = (item) => {
    setMainInfo({
      ...mainInfo,
      medium: (item.nested_options && item.nested_options.length > 0 ? item.nested_options[0]
        : (item.options && item.options.length > 0 ? item.options[0]
        : item))
    });
  }
  const setComposer = (item) => {
    setMainInfo({ ...mainInfo, composer: item });
  }
  const setSpecies = (item) => {
    setMainInfo({ ...mainInfo, genre: item });
  }
  const setPublisher = (item) => {
    setMainInfo({ ...mainInfo, publisher: item });
  }

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
              {resourceData.mediumData.length > 0 && <MediumSelect items={resourceData.mediumData} mainInfo={mainInfo} setMainInfo={setMainInfo} onItemClick={setMedium} />}
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="mb-3">
              <h3>Composer</h3>
              <ComposerSelect items={resourceData.composerData} mainInfo={mainInfo} onItemClick={setComposer} />
            </div>
          </Col>
        </Row>
        <Row className="mt-xs-0 mt-md-4">
          <Col xs={12} md={6}>
            <div className="mb-3">
              <h3>Genre</h3>
              {resourceData.speciesData.length > 0 && <SpeciesSelect items={resourceData.speciesData} mainInfo={mainInfo} onItemClick={setSpecies} />}
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="mb-3">
              <h3>Publisher</h3>
              {resourceData.publisherData.length > 0 && <PublisherSelect items={resourceData.publisherData} mainInfo={mainInfo} onItemClick={setPublisher} />}
            </div>
          </Col>
        </Row>
    </Container>
  );
};

export default MainInfo;
