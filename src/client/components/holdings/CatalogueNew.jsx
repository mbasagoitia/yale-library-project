import { useState, useEffect } from "react";
import { Form, FormGroup, Row, Button } from "react-bootstrap";
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
import { useDispatch } from "react-redux";
import { deleteHolding } from "../../../redux/librarySlice.js";
import clearForm from "../../helpers/catalogue/clearForm.js";
import validateAndClearForm from "../../helpers/catalogue/validateAndClearForm.js";
import deletePiece from "../../helpers/holdings/deletePiece.js";
import Modal from "../general/Modal.jsx";

const CatalogueNew = ({ handleSubmit, initialData, setFilteredItems, setShowResults }) => {

  const { mode, setMode } = useMode();
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

  const [mediumResetKey, setMediumResetKey] = useState(0);

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

  const onSubmit = (e) =>  {
    validateAndClearForm(e, mainInfo, setMainInfo, additionalInfo, setAdditionalInfo, setFormErrors, setShowCall, id, setMediumResetKey, handleSubmit)
  }

  useScrollOnFormErrors(formErrors);

  const setNewAndClear = () => {
    setMode("new");
    clearForm(setShowCall, setMainInfo, setAdditionalInfo, setMediumResetKey, setFormErrors);
  }

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const deleted = await deletePiece(id);
      console.log("deleted", deleted);
      dispatch(deleteHolding(deleted));
      setNewAndClear();
      setFilteredItems([]);
      setShowResults(false);
      setWarningModal(false);
    } catch (err) {
      console.error("Error deleting holding:", err);
    }
  };

  // Move helpers to component where this is defined?
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

  return (
    <div className="catalogueNew">
      <Form onSubmit={onSubmit}>
        {((mode === "new") || (mode === "edit" && initialData && dataReady)) && (
          <>
          {mode == "edit" && (
            <>
            <h2>Editing {mainInfo.title}</h2>
            <Button onClick={setNewAndClear}>Add New Piece Instead</Button>
            </>
          )}
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
        {/* styling here will need to be fixed */}
        <FormGroup as={Row} className="mt-2 d-flex justify-content-center">
          <Button type="submit" className="w-auto">{mode === "new" ? "Catalogue" : "Update"}</Button>
          {mode === "edit" && <Button type="button" onClick={openDeleteModal}>Delete Piece</Button>}
        </FormGroup>
      </Form>
      <Modal show={warningModal} header={"Delete Piece from Library"} content={<><div>Are you sure you want to remove this piece from the library? This action cannot be undone.</div><Button type="button" onClick={handleDelete}>Delete</Button></>} handleCloseModal={closeDeleteModal} />
    </div>
  );
};

export default CatalogueNew;