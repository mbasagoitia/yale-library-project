import React, { useState, useEffect } from 'react';

function MediumSelect({ items, setMediumType }) {
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
    // Is this redundant?
    setSelectedItem(item);
    setMediumType(item);
  };

  return (
    <div>
      <select onChange={(e) => handleSelect(items[e.target.value])} required>
        {items.map((item, index) => (
          <option key={index} value={index}>
            {item.label}
          </option>
        ))}
      </select>

      {selectedItem && selectedItem.options && (
        <MediumSelect items={selectedItem.options} setMediumType={setMediumType} />
      )}
    </div>
  );
}

export default MediumSelect;
