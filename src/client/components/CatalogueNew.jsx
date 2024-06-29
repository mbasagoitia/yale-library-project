import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import MainInfo from "./MainInfo";
import AdditionalInfo from "./AdditionalInfo";
import generateCallNum from "../helpers/generateCallNum.js";
import splitString from "../helpers/splitString.js";
import fetchSingleResourceData from "../helpers/fetchSingleResourceData.js";
import {
  organizeMediumData,
  organizePublisherData,
  organizeSpeciesData } from "../helpers/organizeData.js";
import { useParams } from 'react-router-dom';

const CatalogueNew = ({ initialData, onSubmit }) => {
  const { id } = useParams();
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
    // Honestly I think it might be easier to fetch all resource data as before on form, then use front end logic to filter out based on id...
    const fetchData = async () => {
        try {
            const singleResourceData = await fetchSingleResourceData(initialData.medium_id, initialData.composer_id, initialData.species_id, initialData.publisher_id);
            return singleResourceData;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    };

    if (initialData) {
        fetchData().then(singleResourceData => {
            if (!singleResourceData) return;

            setMainInfo({
                title: initialData.title,
                identifierLabel: initialData.identifier_label,
                identifierValue: initialData.identifier_value,
                number: initialData.number,
                medium: organizeMediumData(singleResourceData.mediumData),
                composer: singleResourceData.composerData,
                genre: organizeSpeciesData(singleResourceData.speciesData),
                publisher: organizePublisherData(singleResourceData.publisherData),
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
        }).catch(error => {
            console.error('Error processing data:', error);
        });
    }
}, [initialData]);


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
          console.log("all info", allInfo);

          if (id) {
            await onSubmit(allInfo, id);
          } else {
            await onSubmit(allInfo);
          }

          setSubmitted(true);

          // Reset form
          setMainInfo({
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

          setAdditionalInfo({
            ownPhysical: true,
            ownDigital: false,
            scansUrl: "",
            ownScore: true,
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
