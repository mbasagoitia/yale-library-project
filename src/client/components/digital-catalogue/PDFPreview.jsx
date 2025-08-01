import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFPreview({ filePath }) {

  const [pdfData, setPdfData] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    window.api.filesystem.readFile(filePath).then((buffer) => {
      setPdfData(buffer);
    });
  }, [filePath]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  if (!pdfData) return <div>Loading...</div>;

  return (
    <div ref={containerRef} style={{ width: '100%', maxWidth: '900px', margin: 'auto', minWidth: '300px' }}>
      <Document file={pdfData}>
        <Page pageNumber={1} width={containerWidth} />
      </Document>
    </div>
  );
}

export default PDFPreview;
