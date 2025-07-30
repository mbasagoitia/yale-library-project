import React, { useState, useEffect } from 'react';
import { useFolderContents } from '../../hooks/useFolderContents';
import { handleOpenFile, handleOpenCurrentFolder } from "../../helpers/digital-catalogue/openContents";
import PDFPreview from './PDFPreview';
import { pdfjs } from 'react-pdf';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Modal from '../general/Modal';
import PaginationControls from '../general/PaginationControls';
import Searchbar from '../search-filters/Searchbar';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js`;

const DigitalCatalogueFolders = ({ folderPath }) => {
  
  const { contents, currentPath, navigateTo, goUp } = useFolderContents();
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredFolders.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredFolders(contents);
    } else {
      const lower = searchText.toLowerCase();
      const matches = contents.filter(
        folder => folder.isDirectory && folder.name.toLowerCase().includes(lower)
      );
      setFilteredFolders(matches);
    }
  }, [contents, searchText]);

  const handleCloseModal = () => setIsModalOpen(false);

  const handleNavigate = () => {
    if (selectedPDF) setSelectedPDF(null);
    goUp();
    setSearchText(""); 
  };

  const handleClick = async (item) => {
    if (selectedPDF) setSelectedPDF(null);

    if (item.isDirectory) {
      navigateTo(item.relativePath);
      setSearchText("");
    } else if (item.name.endsWith('.pdf')) {
      const fullPath = await window.api.filesystem.getFullPath(folderPath, item.relativePath);
      setSelectedPDF(fullPath);
      setIsModalOpen(true);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  return (
    <Container fluid className="p-0 mt-4">
      {!currentPath ? (
        <Searchbar
          placeholder={"Search by composer..."}
          onSearch={handleSearch}
        />
      ) : null}
      <div className="dc-nav-info my-4">
        <div className="dc-nav-buttons">
          <Button variant="outline-primary" onClick={handleNavigate} disabled={!currentPath}>
          ← Previous
          </Button>
        </div>
        <div className="d-flex justify-content-between mb-4">
          <div className="w-50">
            <p className="mb-0 text-muted">{currentPath ? `/${currentPath}` : folderPath}</p>
          </div>
            <div className="w-50">
              <Button
                variant="outline-primary" 
                onClick={() => handleOpenCurrentFolder(folderPath, currentPath)}
                className="open-folder-btn w-auto"
              >
                Open in Finder
              </Button>
            </div>
        </div>
      </div>

      <Row className="g-3">
        {currentItems.map((item) => (
          <Col key={item.relativePath} xs={6} sm={4} md={3}>
            <Card
              className="text-center file-card h-100"
              onClick={() => handleClick(item)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Body>
                <div style={{ fontSize: '3rem' }}>
                  {item.isDirectory ? '📁' : '📄'}
                </div>
                <Card.Text className="mt-2 small" title={item.name}>
                  {item.name}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row>
      <PaginationControls
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={filteredFolders.length}
        itemsPerPage={itemsPerPage}
      />
      </Row>
        <Modal
          show={isModalOpen}
          header={"Preview PDF"}
          content={
            <div>
              <div className="d-flex justify-content-center mb-4">
                <Button variant="primary" className="mt-2" onClick={() => handleOpenFile(selectedPDF)}>
                  Open File
                </Button>
              </div>
              <PDFPreview filePath={selectedPDF} />
            </div>
          }
          handleCloseModal={handleCloseModal}
        />
    </Container>
  );
};

export default DigitalCatalogueFolders;
