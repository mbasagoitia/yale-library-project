import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import MainInfo from "./MainInfo.jsx";
import AdditionalInfo from "./AdditionalInfo.jsx";
import handleShowCall from "../../helpers/catalogue/handleShowCall.js";
import handleSubmit from "../../helpers/catalogue/submitPieceInfo.js";
import { scrollToCallWarning, scrollToRequiredWarning } from "../../helpers/catalogue/scrollBehavior.js";
import splitString from "../../helpers//general/splitString.js";
import fetchResourceData from "../../helpers/holdings/fetchResourceData.js";
import { findMediumById, findComposerById, findGenreById, findPublisherById } from "../../helpers/holdings/filterData.js";
import { useParams } from 'react-router-dom';

const CatalogueNew = ({ mode, initialData, onSubmit }) => {
  const { id } = useParams();

  const [resourceData, setResourceData] = useState({
    mediumData: [],
    composerData: [],
    speciesData: [],
    publisherData: [],
  });

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
    if (initialData && resourceData.mediumData.length) {
      setMainInfo({
        title: initialData.title,
        identifierLabel: initialData.identifier_label,
        identifierValue: initialData.identifier_value,
        number: initialData.number,
        medium: findMediumById(resourceData.mediumData, initialData.medium_id),
        composer: findComposerById(resourceData.composerData, initialData.composer_id),
        genre: findGenreById(resourceData.speciesData, initialData.species_id),
        publisher: findPublisherById(resourceData.publisherData, initialData.publisher_id),
        callNumber: splitString(initialData.call_number)
      });

      setAdditionalInfo({
        ownPhysical: initialData.own_physical === 1,
        ownDigital: initialData.own_digital === 1,
        scansUrl: initialData.scans_url,
        publicDomain: initialData.public_domain === 1,
        condition: initialData.condition_id,
        missingParts: initialData.missing_parts === 1,
        notes: initialData.additional_notes
      });

      setDataReady(true);
    }
  }, [initialData, resourceData]);

  const [dataReady, setDataReady] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showCall, setShowCall] = useState(mode === "edit" ? true : false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resources = await fetchResourceData();

        setResourceData({ 
          mediumData: resources[0],
          composerData: resources[1],
          speciesData: resources[2],
          publisherData: resources[3]
         });
      } catch (error) {
        console.error("Error fetching resource data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (formErrors.requiredFieldsWarning) {
      scrollToRequiredWarning();
    }
    if (formErrors.requiredCallFieldsWarning) {
      scrollToCallWarning();
    }
  }, [formErrors]);

  return (
    <div className="catalogueNew">
      <form onSubmit={(e) => handleSubmit(e, mainInfo, setMainInfo, additionalInfo, setAdditionalInfo, setFormErrors, setShowCall, id, onSubmit)}>
        {((mode === "new") || (mode === "edit" && initialData && dataReady)) && (
          <>
            <MainInfo resourceData={resourceData} mainInfo={mainInfo} setMainInfo={setMainInfo} formErrors={formErrors} />
            <div className="d-flex justify-content-center">
              <Button onClick={(e) => handleShowCall(mainInfo, setMainInfo, setShowCall, setFormErrors)} className="btn btn-primary my-2">Generate Call Number</Button>
            </div>
            {showCall && (
              <div className="alert alert-success d-flex flex-column align-items-center my-4" role="alert">
                <h4>Call Number:</h4>
                <div>
                  {mainInfo.callNumber?.map((line, index) => (
                    <div className="callNumLine" key={index}>{line}</div>
                  ))}
                </div>
              </div>
            )}
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
