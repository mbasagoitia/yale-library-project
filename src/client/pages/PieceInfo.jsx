import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Button } from 'react-bootstrap';
import CatalogueNew from "../components/CatalogueNew";
import updatePiece from "../helpers/updatePiece.js";
import deletePiece from "../helpers/deletePiece.js";
import renderIdAndNumber from '../helpers/renderIdAndNumber.js';
import Modal from '../components/Modal.jsx';
import InfoTable from '../components/InfoTable.jsx';

const PieceInfo = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const { isAdmin } = useSelector((state) => state.auth);

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
            {isAdmin ? (
            <div className="d-flex">
              <div onClick={handleOpenEditModal} className="edit-text">Edit</div>
              <div onClick={handleOpenDeleteModal} className="delete-text mx-2">Delete</div>
            </div>
            ): null}

            {isAdmin && isEditModalOpen && (
              <Modal content={<CatalogueNew mode={"edit"} initialData={data} onSubmit={updatePiece} handleCloseModal={handleCloseModal} />} handleCloseModal={handleCloseModal} />
            )}
            {isAdmin && isDeleteModalOpen && (
              <Modal content={
                <>
                <p>Are you sure you want to delete this item?</p>
                  <Button className="btn btn-primary align-self-center" onClick={handleDelete}>Delete</Button>
                </>
            } handleCloseModal={handleCloseModal} />
            )}
            {data && data.id && <InfoTable data={data} />}
          </>
        )}
      </Container>
    </div>
  );
};

export default PieceInfo;
