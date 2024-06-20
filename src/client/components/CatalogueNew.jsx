import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import MainInfo from "./MainInfo";
import AdditionalInfo from "./AdditionalInfo";
import generateCallNum from "../helpers/generateCallNum.js";
import catalogueNew from "../helpers/catalogueNew.js";

const CatalogueNew = () => {
  const [mainInfo, setMainInfo] = useState({
    title: "",
    opus: "",
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
    ownScore: true,
    publicDomain: true,
    condition: 1,
    missingParts: false,
    notes: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [showCall, setShowCall] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };

  const handleShowCall = () => {
    const { medium, composer, genre, publisher } = mainInfo;

    if (!isEmpty(medium) && !isEmpty(composer) && !isEmpty(genre) && !isEmpty(publisher)) {
      const call = generateCallNum(mainInfo);
      setMainInfo({ ...mainInfo, callNumber: call });
      setShowCall(true);
    } else {
      setFormErrors({ requiredCallFieldsWarning: "Please fill in all required fields." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, medium, composer, genre, publisher, callNumber } = mainInfo;

    if (title && medium && composer && genre && publisher && callNumber) {
      if (additionalInfo.missingParts && !additionalInfo.notes.trim()) {
        setFormErrors({ missingPartsWarning: "Please specify which parts are missing." });
      } else {
        try {
          const allInfo = { ...mainInfo, ...additionalInfo };
          
          console.log('Attempting to catalogue');
          
          await catalogueNew(allInfo);
          setSubmitted(true);

          // Reset form
          setMainInfo({
            title: "",
            opus: "",
            number: "",
            medium: {},
            composer: {},
            genre: {},
            publisher: {},
            callNumber: []
          });

          setAdditionalInfo({
            ownPhysical: true,
            ownDigital: false,
            publicDomain: true,
            condition: 1,
            missingParts: false,
            notes: ""
          });

          setFormErrors({});
        } catch (error) {
          console.error('Catalogue error:', error);
        }
      }
    } else {
      setFormErrors({ requiredFieldsWarning: "Please fill in all required fields." });
    }
  };

  useEffect(() => {

    if (formErrors.requiredFieldsWarning) {
      scrollToRequiredWarning();
    }
    if (formErrors.requiredCallFieldsWarning) {
      scrollToCallWarning();
    }
  }, [formErrors]);

  const scrollToRequiredWarning = () => {
    const warning = document.querySelector("#required-fields-warning");
    if (warning) {
      warning.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const scrollToCallWarning = () => {
    const warning = document.querySelector("#required-call-fields-warning");
    if (warning) {
      warning.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="catalogueNew">
      <h1>New Piece Information</h1>
      <form onSubmit={handleSubmit}>
        <MainInfo mainInfo={mainInfo} setMainInfo={setMainInfo} formErrors={formErrors} />
        <Button onClick={handleShowCall} className="btn btn-primary my-2">Generate Call Number</Button>
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
        <div className="mt-4">
          <AdditionalInfo additionalInfo={additionalInfo} setAdditionalInfo={setAdditionalInfo} formErrors={formErrors} setFormErrors={setFormErrors} />
        </div>
      </form>
    </div>
  );
};

export default CatalogueNew;
