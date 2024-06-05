import React, { useState, useEffect } from 'react';
import MediumDropdown from './classifications/components/MediumDropdown';
import medium from './classifications/medium';

function App() {

  useEffect(() => {
    // Reset nested dropdowns whenever the first level menu changes
  }, [medium]);

  return (
    <div className="App">
      <h2>Select Genre</h2>
      <MediumDropdown items={medium} />
    </div>
  );
}

export default App;
