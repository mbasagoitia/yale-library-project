import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "react-bootstrap";
import { handleOpenFile } from "../../helpers/digital-catalogue/openContents";
import { toast } from "react-toastify";

pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;

function PDFViewer({ filePath }) {
  const [pdfData, setPdfData] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef(null);

  // Load the file
  useEffect(() => {
    const readData = async () => {
      try {
        const result = await window.api?.filesystem?.readFile(filePath);
        setPdfData(result);
      } catch (err) {
        toast.error("Error opening file");
      }
    };

    readData();
  }, [filePath]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  if (!pdfData) return <div className="p-5 mx-5">Loading...</div>;

  return (
    <>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "auto",
          minWidth: "300px",
        }}
      >
        <Document
          file={pdfData}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={(err) =>
            toast.error(`PDF load error: ${err.message || err}`)
          }
          onSourceError={(err) =>
            toast.error(`PDF source error: ${err.message || err}`)
          }
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={containerWidth}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          ))}
        </Document>
      </div>
    </>
  );
}

export default PDFViewer;
