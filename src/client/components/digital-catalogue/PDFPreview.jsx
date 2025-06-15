import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFPreview({ filePath }) {
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    window.electronAPI.readFile(filePath).then((buffer) => {
      setPdfData(buffer);
    });
  }, [filePath]);

  if (!pdfData) return <div>Loading...</div>;

  return (
    <Document file={pdfData}>
      <Page pageNumber={1} />
    </Document>
  );
}

export default PDFPreview;