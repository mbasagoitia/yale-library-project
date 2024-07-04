import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import CatalogueNew from "../components/CatalogueNew";
import updatePiece from "../helpers/updatePiece.js";
import deletePiece from "../helpers/deletePiece.js";
import formatDate from '../helpers/formatDate.js';
import renderIdAndNumber from '../helpers/renderIdAndNumber.js';

const PieceInfo = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/holdings-data/${id}`);
        const data = await res.json();
        setData(data[0]);
        console.log(data[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await deletePiece(id);
      setIsDeleteModalOpen(false);
      navigate("/browse-holdings");
    } catch (error) {
      console.error('Catalogue error:', error);
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  // Can this be put into separate helper function?

  const handleEscKeyPress = (e) => {
    if (e.key === "Escape") {
      setIsEditModalOpen(false);
      setIsDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscKeyPress);
    return () => {
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, []);

  return (
    <div>
      <Container>
        {data && (
          <>
            <h1 className="mb-4">{data.title} {renderIdAndNumber(data)}</h1>
            {/* Only render these if the user has the correct permissions */}
            <div className="d-flex">
              <div onClick={handleOpenEditModal} className="edit-text">Edit</div>
              <div onClick={handleOpenDeleteModal} className="delete-text mx-2">Delete</div>
            </div>
            {/* These modals need to be in a separate modal component */}
            {isEditModalOpen && (
              <div className="modal-overlay">
                <div className="popup">
                  <span className="close-button" onClick={handleCloseModal}>×</span>
                  <div className="modal-content">
                    <CatalogueNew mode={"edit"} initialData={data} onSubmit={updatePiece} handleCloseModal={handleCloseModal} />
                  </div>
                </div>
              </div>
            )}
            {isDeleteModalOpen && (
              <div className="modal-overlay">
                <div className="popup">
                  <span className="close-button" onClick={handleCloseModal}>×</span>
                  <div className="modal-content">
                    <p>Are you sure you want to delete this item?</p>
                    <Button className="btn btn-primary align-self-center" onClick={handleDelete}>Delete</Button>
                  </div>
                </div>
              </div>
            )}
            <Table striped bordered className="mt-3">
              <tbody>
                <tr>
                  <td><strong>Composer</strong></td>
                  <td>{`${data.first_name} ${data.last_name}`}</td>
                </tr>
                <tr>
                  <td><strong>Publisher</strong></td>
                  <td>{data.publisher}</td>
                </tr>
                <tr>
                  <td><strong>Acquisition Date</strong></td>
                  <td>{data.acquisition_date ? formatDate(data.acquisition_date) : "Unknown"}</td>
                </tr>
                <tr>
                  <td><strong>Call Number</strong></td>
                  <td>{data.call_number}</td>
                </tr>
                <tr>
                  <td><strong>Public Domain</strong></td>
                  <td>{data.public_domain ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td><strong>Digital Scans</strong></td>
                  <td>
                    {data.own_digital ? <a href={data.scans_url} target="_blank" rel="noreferrer" className="ml-2">Yes</a> : "No"}
                  </td>
                </tr>
                <tr>
                  <td><strong>Condition</strong></td>
                  <td>{data.condition}</td>
                </tr>
                {data.additional_notes && (
                  <tr>
                    <td><strong>Additional Notes</strong></td>
                    <td>{data.additional_notes}</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        )}
      </Container>
    </div>
  );
};

export default PieceInfo;
