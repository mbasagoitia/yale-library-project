import { useState, useEffect, useImperativeHandle, forwardRef, } from "react";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { Form, FormGroup, Row, Button } from "react-bootstrap";

import MainInfo from "./MainInfo.jsx";
import AdditionalInfo from "./AdditionalInfo.jsx";
import Modal from "../general/Modal.jsx";
import CallNumberDisplay from "./CallNumberDisplay.jsx";

import handleShowCall from "../../helpers/catalogue/handleShowCall.js";
import initializePieceState from "../../helpers/catalogue/initializePieceState.js";
import { dispatchNewPiece, dispatchUpdatePiece, dispatchDeletePiece } from "../../helpers/holdings/updateReduxHoldings.js";

import useFetchResourceData from "../../hooks/useFetchResourceData.js";
import useScrollOnFormErrors from "../../hooks/useScrollOnFormErrors.js";
import { useMode } from "../../contexts/ModeContext.js";

import catalogueNew from "../../helpers/holdings/catalogueNew.js";
import updatePiece from "../../helpers/holdings/updatePiece.js";
import deletePiece from "../../helpers/holdings/deletePiece.js";
import clearForm from "../../helpers/holdings/clearForm.js";
import processAndSubmitForm from "../../helpers/holdings/processAndSubmitForm.js";

import "../../../assets/styles/components/CatalogueForm.css";


const CatalogueForm = forwardRef((props, ref) => {

  const [dataReady, setDataReady] = useState(false);
  const [formErrors, setFormErrors] = useState({});

    // Get info from parent component
  const { mode, setMode, mediumResetKey, setMediumResetKey } = useMode();

  const [showCall, setShowCall] = useState(mode === "edit" ? true : false);

  // Any initial data passed in (updating existing data)
  const { initialData } = props;
  const id = initialData?.id;

  // List of composer, medium, publisher, etc. data
  const resourceData = useFetchResourceData();

  const dispatch = useDispatch();

  // For scroll behavior if there are errors
  useScrollOnFormErrors(formErrors);

  // Define a resetForm function that can be called from parent component
  useImperativeHandle(ref, () => ({
    resetForm () {
      clearForm(setShowCall, setMainInfo, setAdditionalInfo, setMediumResetKey, setFormErrors);
    }
  }));

  // Main form info used to determine title, call number, and catalogue category
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

  // Additional info used to determine piece condition, statistics, etc.
  const [additionalInfo, setAdditionalInfo] = useState({
    ownPhysical: true,
    ownDigital: false,
    scansUrl: "",
    publicDomain: true,
    condition: 1,
    missingParts: false,
    acquisitionDate: new Date(),
    lastPerformed: null,
    notes: ""
  });

  // Set initial data on component if it exists
  useEffect(() => {
    if (initialData) {
      initializePieceState({ initialData, resourceData, setMainInfo, setAdditionalInfo, setDataReady });
    }

  }, [initialData, resourceData]);  

  // Add new piece to the database
  const handleAddNewPiece = async () => {
      const result = await processAndSubmitForm(mainInfo, setMainInfo, additionalInfo, setAdditionalInfo, setFormErrors, setShowCall, id, setMediumResetKey, catalogueNew, dispatch, dispatchNewPiece);
      if (result.success) {
        toast.success("Successfully added new piece");
        setMode("new");
      } else {
        toast.error("Error adding piece:" + result.message);
      }
  };

  // Update existing piece
  const handleUpdatePiece = async () => {
      const result = await processAndSubmitForm(mainInfo, setMainInfo, additionalInfo, setAdditionalInfo, setFormErrors, setShowCall, id, setMediumResetKey, updatePiece, dispatch, dispatchUpdatePiece);
      if (result.success) {
        toast.success("Piece successfully updated");
        setMode("new");
      } else {
        toast.error("Error updating piece: " + result.message);
      }
  };

  const handleShow = (e) => {
    e.preventDefault();
    handleShowCall(mainInfo, setMainInfo, setShowCall, setFormErrors);
  };

  // Warn the user that they have clicked the delete button
  const [warningModal, setWarningModal] = useState(false);

  const openDeleteModal = () => {
    setWarningModal(true);
  }

  const closeDeleteModal = () => {
    setWarningModal(false);
  }

  // Handle deletion of a piece
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      // Delete piece from database and redux store
      const deleted = await deletePiece(id);
      dispatchDeletePiece(dispatch, deleted);
      // Clear form
      setWarningModal(false);
      clearForm(setShowCall, setMainInfo, setAdditionalInfo, setMediumResetKey, setFormErrors);
      toast.success("Successfully deleted piece from library")
      // Set mode back to new (default)
      setMode("new");
    } catch (err) {
      toast.error("Error deleting holding:", err);
    }
  };

  // Submit form and call function based on mode (add or update)
  const onSubmit = (e) =>  {
      e.preventDefault();

      if (mode === "new") {
        handleAddNewPiece();
      } else if (mode === "edit") {
        handleUpdatePiece();
      }
  }

  return (
    <div className="catalogueForm">
      <Form onSubmit={(e) => onSubmit(e)}>
        {((mode === "new") || (mode === "edit" && initialData && dataReady)) && (
          <>
            <MainInfo mainInfo={mainInfo} setMainInfo={setMainInfo} formErrors={formErrors} mediumResetKey={mediumResetKey} setMediumResetKey={setMediumResetKey} />
            <div className="d-flex justify-content-center">
              <Button onClick={(e) => handleShow(e)} className="btn btn-primary my-2">Generate Call Number</Button>
            </div>
            {showCall && <CallNumberDisplay callNumber={mainInfo.callNumber || []} />}
          </>
        )}
        <div className="mt-4">
          <AdditionalInfo mode={mode} additionalInfo={additionalInfo} setAdditionalInfo={setAdditionalInfo} formErrors={formErrors} setFormErrors={setFormErrors} />
        </div>
        <FormGroup as={Row} className={`mt-2 d-flex justify-content-center ${mode === "new" ? "" : "gap-1"}`}>
          <Button type="submit" className="w-auto">{mode === "new" ? "Catalogue" : "Update"}</Button>
          {mode === "edit" && <Button type="button" variant="danger" className="w-auto" onClick={openDeleteModal}>Delete Piece</Button>}
        </FormGroup>
      </Form>
      <Modal show={warningModal} header={"Delete Piece from Library"} content={<div className="d-flex flex-column align-items-center"><div className="text-center mb-4">Are you sure you want to remove this piece from the library? This action cannot be undone.</div><Button type="button" variant="danger" onClick={handleDelete}>Delete</Button></div>} handleCloseModal={closeDeleteModal} />
    </div>
  );
});

export default CatalogueForm;