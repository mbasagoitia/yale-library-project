import React, { useState } from 'react';
import topLevel from '../topLevel';

function GenreDropdown({ items }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelect = (item) => {
    if (item.options) {
      // If the selected item has options, update the selected item
      setSelectedItem(item);
    } else {
      // If the selected item does not have options, log it to the console
      console.log(item.label);
    }
  };

  return (
    <div>
      <select onChange={(e) => handleSelect(items[e.target.value])}>
        <option>Select an option</option>
        {items.map((item, index) => (
          <option key={index} value={index}>
            {item.label}
          </option>
        ))}
      </select>

      {selectedItem && selectedItem.options && (
        <GenreDropdown items={Object.entries(selectedItem.options).map(([key, value]) => ({ label: value }))} />
      )}
    </div>
  );
}

export default GenreDropdown;