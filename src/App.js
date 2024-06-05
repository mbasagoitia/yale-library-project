import React, { useState, useEffect } from 'react';
import GenreDropdown from './classifications/components/GenreDropdown';
import topLevel from './classifications/topLevel';

function App() {

  useEffect(() => {
    // Reset nested dropdowns whenever the first level menu changes
  }, [topLevel]);

  return (
    <div className="App">
      <h2>Select Genre</h2>
      <GenreDropdown items={topLevel} />
    </div>
  );
}

export default App;
