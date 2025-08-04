import { useEffect, useState } from "react";
import { Container, Row, Form } from "react-bootstrap";
import generateCallNum from "../../helpers/holdings/generateCallNum.js";
import MediumSelect from '../holdings/call-number-selects/MediumSelect';
import ComposerSelect from "../holdings/call-number-selects/ComposerSelect";
import SpeciesSelect from "../holdings/call-number-selects/SpeciesSelect";
import PublisherSelect from "../holdings/call-number-selects/PublisherSelect";
import IdAndNumber from "../holdings/call-number-selects/IdAndNumber";
import useFetchResourceData from "../../hooks/useFetchResourceData.js";

const MainInfo = ({ mainInfo, setMainInfo, formErrors, mediumResetKey, setMediumResetKey }) => {
  const resourceData = useFetchResourceData();

  useEffect(() => {
    if (mainInfo.medium) {
      setMediumResetKey(mediumResetKey + 1);
    }
  }, [mainInfo])

  const setMedium = (item) => {
    const selected =
      item.nested_options?.length > 0
        ? item.nested_options[0]
        : item.options?.length > 0
        ? item.options[0]
        : item;

    setMainInfo(prev => {
      const updated = { ...prev, medium: selected };
      const call = generateCallNum(updated);
      return { ...updated, callNumber: call };
    });
  };

  const setComposer = (item) => {
    setMainInfo(prev => {
      const updated = { ...prev, composer: item };
      const call = generateCallNum(updated);
      return { ...updated, callNumber: call };
    });
  };

  const setSpecies = (item) => {
    setMainInfo(prev => {
      const updated = { ...prev, genre: item };
      const call = generateCallNum(updated);
      return { ...updated, callNumber: call };
    });
  };

  const setPublisher = (item) => {
    setMainInfo(prev => {
      const updated = { ...prev, publisher: item };
      const call = generateCallNum(updated);
      return { ...updated, callNumber: call };
    });
  };

  return (
    <Container>
      <Row className="mb-4">
        <div id="required-fields-warning" className={`${formErrors.requiredFieldsWarning ? "feedback my-2" : "d-none"}`}>
          {formErrors.requiredFieldsWarning}
        </div>

        <Form.Group controlId="titleInput">
          <Form.Label>Title:</Form.Label>
          <Form.Control 
            type="text" 
            value={mainInfo.title} 
            onChange={(e) => setMainInfo({ ...mainInfo, title: e.target.value })}
            placeholder="e.g. Symphony no. 2 in D major" 
          />
        </Form.Group>
      </Row>

      <Row className="my-4">
        <IdAndNumber mainInfo={mainInfo} setMainInfo={setMainInfo} />
      </Row>

      <Row className="my-4">
        <div id="required-call-fields-warning" className={`${formErrors.requiredCallFieldsWarning ? "feedback my-2" : "d-none"}`}>
          {formErrors.requiredCallFieldsWarning}
        </div>

        <div>
          <h3>Ensemble Type</h3>
          {resourceData.mediumData.length > 0 && (
            <MediumSelect
              initialValue={mainInfo.medium || ""}
              resetKey={mediumResetKey}
              items={resourceData.mediumData}
              handleItemSelect={setMedium}
            />
          )}
        </div>
      </Row>

      <Row className="my-4">
        <div>
          <h3>Composer</h3>
          {resourceData.composerData.length > 0 && (
            <ComposerSelect items={resourceData.composerData} mainInfo={mainInfo} onItemClick={setComposer} />
          )}
        </div>
      </Row>

      <Row className="my-4">
        <div>
          <h3>Genre</h3>
          {resourceData.speciesData.length > 0 && (
            <SpeciesSelect items={resourceData.speciesData} mainInfo={mainInfo} onItemClick={setSpecies} />
          )}
        </div>
      </Row>

      <Row className="my-4">
        <div>
          <h3>Publisher</h3>
          {resourceData.publisherData.length > 0 && (
            <PublisherSelect items={resourceData.publisherData} mainInfo={mainInfo} onItemClick={setPublisher} />
          )}
        </div>
      </Row>
    </Container>
  );
};

export default MainInfo;
