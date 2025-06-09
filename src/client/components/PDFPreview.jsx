import { Document, Page } from 'react-pdf';
import { useState } from 'react';

const PDFPreview = ({ filePath }) => {
  const [numPages, setNumPages] = useState(null);

  return (
    <div className="pdf-preview">
      <Document
        file={`file://${filePath}`}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        {Array.from({ length: numPages }, (_, i) => (
          <Page key={i + 1} pageNumber={i + 1} />
        ))}
      </Document>
    </div>
  );
};

export default PDFPreview;