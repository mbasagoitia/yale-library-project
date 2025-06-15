import React, { useState, useEffect } from 'react';
import { useFolderContents } from '../../hooks/useFolderContents';
import PDFPreview from './PDFPreview';
import { pdfjs } from 'react-pdf';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Modal from '../general/Modal';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js`;

const DigitalCatalogueFolders = () => {
  const { contents, currentPath, navigateTo, goUp } = useFolderContents();
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [basePath, setBasePath] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  useEffect(() => {
    const fetchBasePath = async () => {
      if (window.electronAPI?.getBasePath) {
        const result = await window.electronAPI.getBasePath();
        setBasePath(result);
      }
    };
    fetchBasePath();
  }, []);

  const handleNavigate = () => {
    if (selectedPDF) setSelectedPDF(null);
    goUp();
  };

  const handleClick = async (item) => {
    if (selectedPDF) setSelectedPDF(null);
    if (item.isDirectory) {
      navigateTo(item.relativePath);
    } else if (item.name.endsWith('.pdf')) {
      const fullPath = await window.electronAPI.getFullPath(basePath, item.relativePath);
      setSelectedPDF(fullPath);
      setIsModalOpen(true);
    }
  };

  const handleOpenFile = async () => {
    const result = await window.electronAPI.openFile(selectedPDF);
    if (!result.success) alert(`Could not open file: ${result.error}`);
  };

  const handleOpenCurrentFolder = async () => {
    const fullPath = await window.electronAPI.getFullPath(basePath, currentPath);
    const result = await window.electronAPI.openFolder(fullPath);
    if (!result.success) alert(`Could not open folder: ${result.error}`);
  };

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Button variant="outline-primary" onClick={handleNavigate} disabled={!currentPath}>
            ⬅️ Previous
          </Button>
          {currentPath && (
            <Button variant="outline-primary" className="ms-2" onClick={handleOpenCurrentFolder}>
              Open in Finder
            </Button>
          )}
        </div>
        <h5 className="mb-0 text-muted">
          {currentPath ? `/${currentPath}` : basePath}
        </h5>
      </div>

      <Row className="g-3">
        {contents.map((item) => (
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
        <Modal content={<div>
          <h4>Preview: {selectedPDF}</h4>
          <PDFPreview filePath={selectedPDF} />
          <Button variant="success" className="mt-2" onClick={handleOpenFile}>
            Open File
          </Button>
        </div>} handleCloseModal={handleCloseModal} />
      )}
    </Container>
  );
};

export default DigitalCatalogueFolders;
