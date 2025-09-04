import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from 'react-bootstrap';
import { handleOpenFile } from '../../helpers/digital-catalogue/openContents';
import { toast } from 'react-toastify';

// Start here
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFPreview({ filePath }) {

  const [pdfData, setPdfData] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const readData = async () => {
      try {
        const result = await window.api?.filesystem?.readFile(filePath);
        setPdfData(result);
      } catch (err) {
        toast.error("Error opening file. Digital catalogue may have been removed or deleted.")
      }
    }

    readData();

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

  if (!pdfData) return <div className="p-5 mx-5">Loading...</div>;

  return (
    <>
    <div className="d-flex justify-content-center mb-4">
      <Button variant="primary" className="mt-2" onClick={() => handleOpenFile(filePath)}>
        Open File
      </Button>
    </div>
    <div ref={containerRef} style={{ width: '100%', maxWidth: '900px', margin: 'auto', minWidth: '300px' }}>
      <Document
        file={pdfData}
        // onLoadSuccess={({ numPages }) => console.log('PDF loaded, pages:', numPages)}
        onLoadError={(err) => toast.error('PDF load error:', err)}
        onSourceError={(err) => toast.error('PDF source error:', err)}>
        <Page pageNumber={1} width={containerWidth} />
      </Document>
    </div>
    </>
  );
}

export default PDFPreview;
