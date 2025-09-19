import React, { useState, useEffect } from 'react';
import useFolderContents from '../../hooks/useFolderContents';
import { handleOpenCurrentFolder } from "../../helpers/digital-catalogue/openContents";
import PDFPreview from './PDFPreview';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Modal from '../general/Modal';
import PaginationControls from '../general/PaginationControls';
import Searchbar from '../search-filters/Searchbar';
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;

const DigitalCatalogueFolders = ({ folderPath }) => {

  const { contents, currentPath, navigateTo, goUp } = useFolderContents(folderPath);
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
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
      setSelectedPDF(item.relativePath);
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

          <Button

            variant="outline-primary"
            onClick={handleNavigate}
            disabled={!currentPath || currentPath === folderPath}
            className="prev-folder-btn"
          >
          ← Previous
          </Button>

          <Button
            variant="outline-primary" 
            onClick={() => handleOpenCurrentFolder(currentPath)}
          >
            Open Folder
          </Button>


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
        <div className="mt-4">
          <PaginationControls
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalItems={filteredFolders.length}
            itemsPerPage={itemsPerPage}
          />
      </div>
      </Row>
      <Modal
        show={isModalOpen}
        header={"PDF Preview"}
        content={
          <div>
            <PDFPreview filePath={selectedPDF} />
          </div>
        }
        handleCloseModal={handleCloseModal}
      />
    </Container>
  );
};

export default DigitalCatalogueFolders;
