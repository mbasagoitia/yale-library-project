import React, { useState, useEffect } from "react";
import useFolderContents from "../../hooks/useFolderContents";
import { handleOpenFile } from "../../helpers/digital-catalogue/openContents";
import PDFPreview from "./PDFPreview";
import CreateFolderModal from "../general/CreateFolderModal";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Modal from "../general/Modal";
import PaginationControls from "../general/PaginationControls";
import Searchbar from "../search-filters/Searchbar";
import { Trash2, MoveRight } from "lucide-react";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;

const ManageDigitalCatalogue = ({ folderPath }) => {
  const { contents, currentPath, navigateTo, goUp } = useFolderContents(folderPath);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCFModal, setShowCFModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [destinationPath, setDestinationPath] = useState("");
  const [warningModal, setWarningModal] = useState(false);

  const itemsPerPage = 8;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredItems(contents);
    } else {
      const lower = searchText.toLowerCase();
      const matches = contents.filter((item) =>
        item.name.toLowerCase().includes(lower)
      );
      setFilteredItems(matches);
    }
  }, [contents, searchText]);

  const handleNavigateUp = () => {
    if (selectedPDF) setSelectedPDF(null);
    goUp();
    setSearchText("");
  };

  const handleClick = (item) => {
    if (selectedPDF) setSelectedPDF(null);

    if (item.isDirectory) {
      navigateTo(item.relativePath);
      setSearchText("");
    } else if (item.name.endsWith(".pdf")) {
      setSelectedPDF(item.relativePath);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    const fullPath = `${currentPath}/${selectedItem.name}`;
    await window.api.filesystem.deleteItem(fullPath);

    // If this was the last item on the page, and we aren't already on page 1, move back
    if (currentItems.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }

    navigateTo(currentPath);
    setWarningModal(false);
    setSelectedItem(null);
  };

  const handleMove = async () => {
    if (!selectedItem || !destinationPath) return;
    const src = `${currentPath}/${selectedItem.name}`;
    const dest = `${destinationPath}/${selectedItem.name}`;
    await window.api.filesystem.moveItem(src, dest);
    navigateTo(currentPath);
    setMoveDialogOpen(false);
    setDestinationPath("");
  };

  const openFolderPicker = async () => {
    const folder = await window.api.filesystem.chooseFolder(folderPath);
    if (folder) setDestinationPath(folder);
  };

  const handleCreateFolder = async (name) => {
    await window.api.filesystem.createFolder(currentPath, name);
    navigateTo(currentPath);
  };

  const handleAddPDF = async () => {
    const files = await window.api.filesystem.selectFiles(["pdf"]);
    if (files && files.length) {
      for (const file of files) {
        await window.api.filesystem.copyFile(file, currentPath);
      }
      navigateTo(currentPath);
    }
  };

  const hasSubfolders = contents.some((c) => c.isDirectory);

  return (
    <Container fluid className="p-0 mt-4 manage-dc">
      {!currentPath ? (
        <Searchbar placeholder="Search by name..." onSearch={setSearchText} />
      ) : null}

      <div className="dc-nav-info my-4">
        <Button
          variant="outline-primary"
          onClick={handleNavigateUp}
          disabled={!currentPath || currentPath === folderPath}
          className="prev-folder-btn"
        >
          ← Previous
        </Button>

        {hasSubfolders ? (
          <>
            <Button onClick={() => setShowCFModal(true)}>
              + Add Folder
            </Button>
            <CreateFolderModal
              show={showCFModal}
              onClose={() => setShowCFModal(false)}
              onCreate={handleCreateFolder}
            />
          </>
        ) : (
          <Button variant="success" onClick={handleAddPDF}>
            + Add PDF Files
          </Button>
        )}
      </div>

      <div className="manage-dc-container d-flex">
        {currentItems.map((item) => (
          <div key={item.relativePath} className="manage-dc-item">
            <Card
              className="text-center file-card h-100 position-relative"
              onClick={() => handleClick(item)}
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <div style={{ fontSize: "3rem" }}>
                  {item.isDirectory ? "📁" : "📄"}
                </div>
                <Card.Text className="mt-2" title={item.name}>
                  {item.name}
                </Card.Text>
              </Card.Body>

              <div
                className="position-absolute top-0 end-0 m-2 d-flex gap-1"
                style={{ opacity: 0.85 }}
              >
                {item.name.endsWith(".pdf") && (
                  <Button
                    size="sm"
                    variant="light"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedItem(item);
                      setMoveDialogOpen(true);
                    }}
                  >
                    <MoveRight size={14} />
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="danger"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedItem(item);
                    setWarningModal(true);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <Row>
        <div className="mt-4">
          <PaginationControls
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalItems={filteredItems.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </Row>

      {/* PDF Preview */}
      <Modal
        show={isModalOpen}
        header="PDF Preview"
        content={
          <div>
            <div className="d-flex justify-content-center mb-4">
              <Button
                variant="primary"
                className="mt-2"
                onClick={() => handleOpenFile(selectedPDF)}
              >
                Open File
              </Button>
            </div>
            <PDFPreview filePath={selectedPDF} isVisible={isModalOpen} />
          </div>
        }
        handleCloseModal={() => setIsModalOpen(false)}
      />

      {/* Move To Modal */}
      <Modal
        show={moveDialogOpen}
        header={`Move "${selectedItem?.name}"`}
        content={
          <div>
            <p>Choose destination folder:</p>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                value={destinationPath}
                readOnly
                placeholder="No folder selected"
              />
              <Button variant="outline-primary" onClick={openFolderPicker}>
                Browse...
              </Button>
            </div>
          </div>
        }
        handleCloseModal={() => setMoveDialogOpen(false)}
        footer={
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={() => setMoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMove} disabled={!destinationPath}>
              Move
            </Button>
          </div>
        }
      />

      {/* Delete confirmation modal */}
      <Modal
        show={warningModal}
        header="Delete from Digital Catalogue"
        content={
          <div className="d-flex flex-column align-items-center">
            <div className="text-center mb-4">
              Are you sure you want to remove{" "}
              <strong>{selectedItem?.name}</strong> from the catalogue?  
              This action cannot be undone.
            </div>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setWarningModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        }
        handleCloseModal={() => setWarningModal(false)}
      />
    </Container>
  );
};

export default ManageDigitalCatalogue;
