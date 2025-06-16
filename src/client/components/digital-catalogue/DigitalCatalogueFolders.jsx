import React, { useState, useEffect } from 'react';
import { useFolderContents } from '../../hooks/useFolderContents';
import { handleOpenFile, handleOpenCurrentFolder } from "../../helpers/digital-catalogue/openContents";
import PDFPreview from './PDFPreview';
import { pdfjs } from 'react-pdf';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Modal from '../general/Modal';
import Searchbar from '../search-filters/Searchbar';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js`;

const DigitalCatalogueFolders = ({ folderPath }) => {
  const { contents, currentPath, navigateTo, goUp } = useFolderContents();
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

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
      const fullPath = await window.electronAPI.getFullPath(folderPath, item.relativePath);
      setSelectedPDF(fullPath);
      setIsModalOpen(true);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  return (
    <Container fluid className="p-4">
      <Searchbar
        placeholder={"Search by composer..."}
        onSearch={handleSearch}
      />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Button variant="outline-primary" onClick={handleNavigate} disabled={!currentPath}>
            ⬅️ Previous
          </Button>
          {currentPath && (
            <Button
              variant="outline-primary"
              className="ms-2"
              onClick={() => handleOpenCurrentFolder(folderPath, currentPath)}
            >
              Open in Finder
            </Button>
          )}
        </div>
        <h5 className="mb-0 text-muted">
          {currentPath ? `/${currentPath}` : folderPath}
        </h5>
      </div>

      <Row className="g-3">
        {filteredFolders.map((item) => (
          <Col key={item.relativePath} xs={6} sm={4} md={3} lg={2}>
            <Card
              className="text-center file-card h-100"
              onClick={() => handleClick(item)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Body>
                <div style={{ fontSize: '2rem' }}>
                  {item.isDirectory ? '📁' : '📄'}
                </div>
                <Card.Text className="mt-2 small text-truncate" title={item.name}>
                  {item.name}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {isModalOpen && (
        <Modal
          content={
            <div>
              <h4>Preview: {selectedPDF}</h4>
              <PDFPreview filePath={selectedPDF} />
              <Button variant="success" className="mt-2" onClick={() => handleOpenFile(selectedPDF)}>
                Open File
              </Button>
            </div>
          }
          handleCloseModal={handleCloseModal}
        />
      )}
    </Container>
  );
};

export default DigitalCatalogueFolders;
