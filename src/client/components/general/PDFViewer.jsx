import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { toast } from "react-toastify";
import PaginationControls from "./PaginationControls";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

function PDFViewer({ filePath, fileLocation }) {
  const [pdfData, setPdfData] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef(null);

  // Load PDF data (local or public)
  useEffect(() => {
    let isMounted = true;

    const readData = async () => {
      try {
        const raw =
          fileLocation === "public"
            ? await window.api.filesystem.readPublicFile(filePath)
            : await window.api.filesystem.readFile(filePath);

        if (isMounted) {
          // Ensure data is a Uint8Array
          const array = raw instanceof Uint8Array ? raw : new Uint8Array(raw);
          setPdfData({ data: array });
        }
      } catch (err) {
        toast.error(`Error opening file: ${err.message || err}`);
      }
    };

    readData();
    return () => {
      isMounted = false;
      setPdfData(null); // cleanup avoids detached ArrayBuffer issues
    };
  }, [filePath, fileLocation]);

  // Track container width for responsive scaling
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

  if (!pdfData) return <div className="p-5 mx-5">Loading…</div>;

  return (
    <div style={{ maxWidth: 900, margin: "auto", minWidth: 300 }}>
      <div ref={containerRef} style={{ width: "100%", marginBottom: "1rem" }}>
        <Document
          file={pdfData}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setPageNumber(1);
            requestAnimationFrame(() => {
              window.dispatchEvent(new Event('resize'));
            });
          }}
          onLoadError={(err) =>
            toast.error(`PDF load error: ${err.message || err}`)
          }
          onSourceError={(err) =>
            toast.error(`PDF source error: ${err.message || err}`)
          }
        >
          <Page
            key={`page_${pageNumber}`}
            pageNumber={pageNumber}
            width={containerWidth}
            renderAnnotationLayer
            renderTextLayer
          />
        </Document>
      </div>

      {numPages > 1 && (
        <PaginationControls
          currentPage={pageNumber}
          onPageChange={setPageNumber}
          totalItems={numPages}
          itemsPerPage={1}
        />
      )}
    </div>
  );
}

export default PDFViewer;
