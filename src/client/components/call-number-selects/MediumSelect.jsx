import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';

function MediumSelect({ items, setMediumType }) {
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    // Reset selectedItem to the first item whenever items change
    if (items.length > 0) {
      setSelectedItem(items[0]);
      setMediumType(items[0].value || items[0].options[0].value);
    } else {
      setSelectedItem(null);
    }
  }, [items, setMediumType]);

  const handleSelect = (item) => {
    console.log(item);
    setSelectedItem(item);
    if (item.value) {
      setMediumType(item.value);
    } else {
      setMediumType(item.options[0].value);
    }
  };

  return (
    <div className="my-2">
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          {selectedItem ? selectedItem.label : 'Select Medium'}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {items.map((item, index) => (
            <Dropdown.Item key={index} onClick={() => handleSelect(item)}>
              {item.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {selectedItem && selectedItem.options && (
        <MediumSelect
          key={selectedItem.value || selectedItem.label} // Ensure reset by changing the key
          items={selectedItem.options}
          setMediumType={setMediumType}
        />
      )}
    </div>
  );
}

export default MediumSelect;
