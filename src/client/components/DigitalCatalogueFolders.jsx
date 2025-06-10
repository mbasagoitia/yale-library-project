import React, { useState, useEffect } from 'react';
import { useFolderContents } from '../hooks/useFolderContents';
import { Document, Page } from 'react-pdf';
import PDFPreview from './PDFPreview';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js`;

const DigitalCatalogueFolders = () => {

  const { contents, currentPath, navigateTo, goUp } = useFolderContents();
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [basePath, setBasePath] = useState('');

  useEffect(() => {
    const fetchBasePath = async () => {
      if (window.electronAPI?.getBasePath) {
        const result = await window.electronAPI.getBasePath();
        setBasePath(result);
      } else {
        console.log("No base path set")
      }
    };
    fetchBasePath();
  }, []);

  const handleClick = async (item) => {
    if (item.isDirectory) {
      navigateTo(item.relativePath);
    } else if (item.name.endsWith('.pdf')) {
      const fullPath = await window.electronAPI.getFullPath(basePath, item.relativePath);
      console.log('Full PDF path:', fullPath);
      setSelectedPDF(fullPath);
    }
  };

  return (
    <div className="catalogue-container">
      <button onClick={goUp} disabled={!currentPath}>⬆️ Up</button>
      <h2>Current Folder: /{currentPath}</h2>

      <div className="file-grid">
        {contents.map((item) => (
          <div
            key={item.relativePath}
            className={`file-item ${item.isDirectory ? 'folder' : 'file'}`}
            onClick={() => handleClick(item)}
          >
            <div className="file-icon">
              {item.isDirectory ? '📁' : '📄'}
            </div>
            <div className="file-name">{item.name}</div>
          </div>
        ))}
      </div>

      {selectedPDF && (
        <div className="pdf-preview">
          <h3>Preview: {selectedPDF}</h3>
          <PDFPreview filePath={selectedPDF} />
        </div>
      )}
    </div>
  );
};

export default DigitalCatalogueFolders;
