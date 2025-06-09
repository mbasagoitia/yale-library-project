import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ relativePath }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    const loadPath = async () => {
      const absolutePath = await window.electronAPI.getFullPath(relativePath);
      if (absolutePath) {
        setFileUrl(absolutePath);
      }
    };
    loadPath();
  }, [relativePath]);

  if (!fileUrl) return <p>Loading PDF...</p>;

  return (
    <div>
      <Document file={fileUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
        {Array.from({ length: numPages }, (_, i) => (
          <Page pageNumber={i + 1} key={i} />
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;
