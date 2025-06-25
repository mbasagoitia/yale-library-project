import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import MainInfo from "./MainInfo.jsx";
import AdditionalInfo from "./AdditionalInfo.jsx";
import handleShowCall from "../../helpers/catalogue/handleShowCall.js";
import CallNumberDisplay from "./CallNumberDisplay.jsx";
import handleSubmit from "../../helpers/catalogue/submitPieceInfo.js";
import splitString from "../../helpers//general/splitString.js";
import { findMediumById, findComposerById, findGenreById, findPublisherById } from "../../helpers/holdings/filterData.js";
import initializePieceState from "../../helpers/catalogue/initializePieceState.js";
import { useParams } from 'react-router-dom';
import useFetchResourceData from "../../hooks/useFetchResourceData.js";
import useScrollOnFormErrors from "../../hooks/useScrollOnFormErrors.js";

const CatalogueNew = ({ mode, initialData, submit }) => {

  const { id } = useParams();

  const [dataReady, setDataReady] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showCall, setShowCall] = useState(mode === "edit" ? true : false);

  const [mediumResetKey, setMediumResetKey] = useState(0);

  const resourceData = useFetchResourceData();
  useScrollOnFormErrors(formErrors);

  const [mainInfo, setMainInfo] = useState({
    title: "",
    identifierLabel: "Op.",
    identifierValue: "",
    number: "",
    medium: {},
    composer: {},
    genre: {},
    publisher: {},
    callNumber: []
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    ownPhysical: true,
    ownDigital: false,
    scansUrl: "",
    publicDomain: true,
    condition: 1,
    missingParts: false,
    notes: ""
  });

  useEffect(() => {
    initializePieceState({ initialData, resourceData, setMainInfo, setAdditionalInfo, setDataReady,
      helpers: {
        findMediumById,
        findComposerById,
        findGenreById,
        findPublisherById,
        splitString
      }
    });
  }, [initialData, resourceData]);

  return (
    <div className="catalogueNew">
      <form onSubmit={(e) => handleSubmit(e, mainInfo, setMainInfo, additionalInfo, setAdditionalInfo, setFormErrors, setShowCall, id, setMediumResetKey, submit)}>
        {((mode === "new") || (mode === "edit" && initialData && dataReady)) && (
          <>
            <MainInfo resourceData={resourceData} mainInfo={mainInfo} setMainInfo={setMainInfo} formErrors={formErrors} mediumResetKey={mediumResetKey} />
            <div className="d-flex justify-content-center">
              <Button onClick={(e) => handleShowCall(mainInfo, setMainInfo, setShowCall, setFormErrors)} className="btn btn-primary my-2">Generate Call Number</Button>
            </div>
            {showCall && <CallNumberDisplay callNumber={mainInfo.callNumber} />}
          </>
        )}
        <div className="mt-4">
          <AdditionalInfo mode={mode} additionalInfo={additionalInfo} setAdditionalInfo={setAdditionalInfo} formErrors={formErrors} setFormErrors={setFormErrors} />
        </div>
      </form>
    </div>
  );
};

export default CatalogueNew;