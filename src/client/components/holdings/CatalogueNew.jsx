import { useState, useEffect, useImperativeHandle, forwardRef, } from "react";
import { Form, FormGroup, Row, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import MainInfo from "./MainInfo.jsx";
import AdditionalInfo from "./AdditionalInfo.jsx";
import handleShowCall from "../../helpers/catalogue/handleShowCall.js";
import CallNumberDisplay from "./CallNumberDisplay.jsx";
import splitString from "../../helpers//general/splitString.js";
import { findMediumById, findComposerById, findGenreById, findPublisherById } from "../../helpers/holdings/filterData.js";
import initializePieceState from "../../helpers/catalogue/initializePieceState.js";
import useFetchResourceData from "../../hooks/useFetchResourceData.js";
import useScrollOnFormErrors from "../../hooks/useScrollOnFormErrors.js";
import { useMode } from "../../contexts/ModeContext.js";
import { dispatchNewPiece, dispatchUpdatePiece, dispatchDeletePiece } from "../../helpers/holdings/updateReduxHoldings.js";
import catalogueNew from "../../helpers/holdings/catalogueNew.js";
import updatePiece from "../../helpers/holdings/updatePiece.js";
import deletePiece from "../../helpers/holdings/deletePiece.js";
import clearForm from "../../helpers/holdings/clearForm.js";
import Modal from "../general/Modal.jsx";
import processAndSubmitForm from "../../helpers/holdings/processAndSubmitForm.js";
import { toast } from 'react-toastify';

const CatalogueNew = forwardRef((props, ref) => {

  // Issue is that initial data keeps getting passed in, never reset

  const { initialData } = props;


  const { mode, setMode, mediumResetKey, setMediumResetKey } = useMode();
  const id = initialData?.id;

  const [warningModal, setWarningModal] = useState(false);

  const openDeleteModal = () => {
    setWarningModal(true);
  }

  const closeDeleteModal = () => {
    setWarningModal(false);
  }

  const dispatch = useDispatch();

  const resourceData = useFetchResourceData();

  const [dataReady, setDataReady] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showCall, setShowCall] = useState(mode === "edit" ? true : false);

    useEffect(() => {
      if (initialData) {
        initializePieceState({ initialData, resourceData, setMainInfo, setAdditionalInfo, setDataReady,
          helpers: {
            findMediumById,
            findComposerById,
            findGenreById,
            findPublisherById,
            splitString
          }
        });
      }
  
    }, [initialData, resourceData]);  

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
    lastPerformed: null,
    notes: ""
  });

  useScrollOnFormErrors(formErrors);

  useImperativeHandle(ref, () => ({
    resetForm () {
      // Doesn't really need to be here, can be called from parent
      setMode("new");
      clearForm(setShowCall, setMainInfo, setAdditionalInfo, setMediumResetKey, setFormErrors);
    }
  }));

  const handleAddNewPiece = async () => {
    if (Object.keys(formErrors).length === 0) {
    try {
      processAndSubmitForm(mainInfo, setMainInfo, additionalInfo, setAdditionalInfo, setFormErrors, setShowCall, id, setMediumResetKey, catalogueNew, dispatch, dispatchNewPiece);
        toast.success("Successfully added new piece");
    } catch (err) {
      toast.error("Error adding holding:", err);
    }
  }
  };

  const handleUpdatePiece = async () => {
    if (Object.keys(formErrors).length === 0) {
    try {
      processAndSubmitForm(mainInfo, setMainInfo, additionalInfo, setAdditionalInfo, setFormErrors, setShowCall, id, setMediumResetKey, updatePiece, dispatch, dispatchUpdatePiece);
        toast.success("Successfully updated piece");
    } catch (err) {
      toast.error("Error updating holding:", err);
    }
  }
  };

  // Fix this
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      // Delete piece from database and redux store
      const deleted = await deletePiece(id);
      dispatchDeletePiece(dispatch, deleted);
      // Clear form
      setWarningModal(false);
      clearForm(setShowCall, setMainInfo, setAdditionalInfo, setMediumResetKey, setFormErrors);
      setMode("new");
      toast.success("Successfully deleted piece from library")
    } catch (err) {
      toast.error("Error deleting holding:", err);
    }
  };

  const onSubmit = (e) =>  {
    e.preventDefault();
    if (mode === "new") {
      handleAddNewPiece();
    } else if (mode === "edit") {
      handleUpdatePiece();
    }
    setMode("new");
  }

  return (
    <div className="catalogueNew">
      <Form onSubmit={(e) => onSubmit(e)}>
        {((mode === "new") || (mode === "edit" && initialData && dataReady)) && (
          <>
            <MainInfo mainInfo={mainInfo} setMainInfo={setMainInfo} formErrors={formErrors} mediumResetKey={mediumResetKey} setMediumResetKey={setMediumResetKey} />
            <div className="d-flex justify-content-center">
              <Button onClick={(e) => handleShowCall(mainInfo, setMainInfo, setShowCall, setFormErrors)} className="btn btn-primary my-2">Generate Call Number</Button>
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

export default CatalogueNew;