import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    console.log(item);
    setSelectedItem(item);
    if (item.value) {
      setMediumType(item.value);
    }
  };

  return (
    <div className="my-2">
      <select
        className="form-select"
        id="mediumSelect"
        onChange={(e) => handleSelect(items[e.target.value])}
        required
      >
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
