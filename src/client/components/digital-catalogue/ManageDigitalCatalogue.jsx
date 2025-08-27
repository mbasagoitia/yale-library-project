import React, { useState, useEffect } from "react";
import { useFolderContents } from "../../hooks/useFolderContents";
import { handleOpenFile, handleOpenCurrentFolder } from "../../helpers/digital-catalogue/openContents";
import PDFPreview from "./PDFPreview";
import CreateFolderModal from "../general/CreateFolderModal";
import { pdfjs } from "react-pdf";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Modal from "../general/Modal";
import PaginationControls from "../general/PaginationControls";
import Searchbar from "../search-filters/Searchbar";
import { Trash2, MoveRight } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ManageDigitalCatalogue = ({ folderPath }) => {
  const { contents, currentPath, navigateTo, goUp } = useFolderContents(folderPath);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCFModal, setShowCFModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // disable previous button if at base path
  // Add guards when deleting folders

  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [destinationPath, setDestinationPath] = useState("");

  const itemsPerPage = 10;
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

  const handleCloseModal = () => setIsModalOpen(false);

  const handleNavigateUp = () => {
    if (selectedPDF) setSelectedPDF(null);
    goUp();
    setSearchText("");
  };

  const handleClick = async (item) => {
    if (selectedPDF) setSelectedPDF(null);

    if (item.isDirectory) {
      navigateTo(item.relativePath);
      setSearchText("");
    } else if (item.name.endsWith(".pdf")) {
      setSelectedPDF(item.relativePath);
      setIsModalOpen(true);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleDelete = async (item) => {
    const fullPath = `${currentPath}/${item.name}`;
    await window.api.filesystem.deleteItem(fullPath);
    navigateTo(currentPath); // refresh
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

  // Instead, check if some are PDFs
  const hasSubfolders = contents.some((c) => c.isDirectory);

  return (
    <Container fluid className="p-0 mt-4">
      {!currentPath ? (
        <Searchbar
          placeholder={"Search by name..."}
          onSearch={handleSearch}
        />
      ) : null}

      <div className="dc-nav-info my-4">
        <Button
          variant="outline-primary"
          onClick={handleNavigateUp}
          disabled={!currentPath}
          className="prev-folder-btn"
        >
          ← Previous
        </Button>

        <Button
          variant="outline-primary"
          onClick={() => handleOpenCurrentFolder(folderPath, currentPath)}
        >
          Open Folder
        </Button>

        {hasSubfolders ? (
            <>
              <Button onClick={() => setShowCFModal(true)} className="ms-2">+ Add Folder</Button>
              <CreateFolderModal
                show={showCFModal}
                onClose={() => setShowCFModal(false)}
                onCreate={handleCreateFolder}
              />
          </>
        ) : (
          <Button variant="success" className="ms-2" onClick={handleAddPDF}>
            + Add PDF Files
          </Button>
        )}
      </div>

      <Row className="g-3">
        {currentItems.map((item) => (
          <Col key={item.relativePath} xs={6} sm={4} md={3}>
            <Card
              className="text-center file-card h-100 position-relative"
              onClick={() => handleClick(item)}
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <div style={{ fontSize: "3rem" }}>
                  {item.isDirectory ? "📁" : "📄"}
                </div>
                <Card.Text className="mt-2 small" title={item.name}>
                  {item.name}
                </Card.Text>
              </Card.Body>

              {/* Hover actions */}
              <div
                className="position-absolute top-0 end-0 m-2 d-flex gap-1"
                style={{ opacity: 0.85 }}
              >
                {item.name.endsWith(".pdf") ? (<Button
                  size="sm"
                  variant="light"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item);
                    setMoveDialogOpen(true);
                  }}
                >
                <MoveRight size={14} />
                </Button>) : null}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <div className="mt-4">
          <PaginationControls
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={filteredItems.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </Row>

      {/* PDF Preview */}
      <Modal
        show={isModalOpen}
        header={"PDF Preview"}
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
        handleCloseModal={handleCloseModal}
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
              <Button variant="outline-secondary" onClick={openFolderPicker}>
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
    </Container>
  );
};

export default ManageDigitalCatalogue;
