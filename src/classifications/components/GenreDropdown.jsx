import React, { useState, useEffect } from 'react';

function GenreDropdown({ items }) {
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    // Reset selectedItem to the first item whenever items change
    if (items.length > 0) {
      setSelectedItem(items[0]);
    } else {
      setSelectedItem(null);
    }
  }, [items]);

  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  return (
    <div>
      <select onChange={(e) => handleSelect(items[e.target.value])}>
        {items.map((item, index) => (
          <option key={index} value={index}>
            {item.label}
          </option>
        ))}
      </select>

      {selectedItem && selectedItem.options && (
        <GenreDropdown items={selectedItem.options} />
      )}
    </div>
  );
}

export default GenreDropdown;
