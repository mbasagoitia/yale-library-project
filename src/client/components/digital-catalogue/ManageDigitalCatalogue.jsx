import React, { useState, useEffect } from "react";
import useFolderContents from "../../hooks/useFolderContents";
import { handleOpenFile } from "../../helpers/digital-catalogue/openContents";
import PaginationControls from "../general/PaginationControls";
import Toolbar from "./Toolbar";
import CatalogueGrid from "./CatalogueGrid";
import PDFPreviewModal from "./PDFPreviewModal";
import MoveModal from "./MoveModal";
import DeleteModal from "./DeleteModal";
import { Container, Row } from "react-bootstrap";

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
      setFilteredItems(contents.filter((item) => item.name.toLowerCase().includes(lower)));
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

  const handleAddPDF = async () => {
    const files = await window.api.filesystem.selectFiles(["pdf"]);
    if (files && files.length) {
      for (const file of files) {
        await window.api.filesystem.copyFile(file, currentPath);
      }
      navigateTo(currentPath);
    }
  };

  const handleCreateFolder = async (name) => {
    await window.api.filesystem.createFolder(currentPath, name);
    navigateTo(currentPath);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    const fullPath = `${currentPath}/${selectedItem.name}`;
    await window.api.filesystem.deleteItem(fullPath);
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

  const hasSubfolders = contents.some((c) => c.isDirectory);

  return (
    <Container fluid className="p-0 mt-4 manage-dc">
      <Toolbar
        currentPath={currentPath}
        rootPath={folderPath}
        hasSubfolders={hasSubfolders}
        onNavigateUp={handleNavigateUp}
        onCreateFolder={handleCreateFolder}
        onAddPDF={handleAddPDF}
        searchText={searchText}
        setSearchText={setSearchText}
        showCFModal={showCFModal}
        setShowCFModal={setShowCFModal}
      />

      <CatalogueGrid
        items={currentItems}
        onClick={handleClick}
        onMove={(item) => { setSelectedItem(item); setMoveDialogOpen(true); }}
        onDelete={(item) => { setSelectedItem(item); setWarningModal(true); }}
      />

      <Row className="mt-4">
        <PaginationControls
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalItems={filteredItems.length}
          itemsPerPage={itemsPerPage}
        />
      </Row>

      <PDFPreviewModal
        show={isModalOpen}
        filePath={selectedPDF}
        onClose={() => setIsModalOpen(false)}
      />

      <MoveModal
        show={moveDialogOpen}
        item={selectedItem}
        destination={destinationPath}
        onBrowse={openFolderPicker}
        onMove={handleMove}
        onClose={() => setMoveDialogOpen(false)}
      />

      <DeleteModal
        show={warningModal}
        item={selectedItem}
        onDelete={handleDelete}
        onClose={() => setWarningModal(false)}
      />
    </Container>
  );
};

export default ManageDigitalCatalogue;
