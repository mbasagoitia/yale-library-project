import { useState } from 'react';
import PDFViewer from './PDFViewer';

const DigitalHoldingsItem = ({ piece }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="digital-item">
      <p>{piece.title}</p>
      <button onClick={() => setShowPreview(true)}>Preview</button>
      {showPreview && (
        <div className="pdf-modal">
          <button onClick={() => setShowPreview(false)}>Close</button>
          <PDFViewer relativePath={piece.relativePath} />
        </div>
      )}
    </div>
  );
};

export default DigitalHoldingsItem;