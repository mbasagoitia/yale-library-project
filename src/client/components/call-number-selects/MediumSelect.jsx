import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

function MediumSelect({ items, mainInfo, setMainInfo }) {
  const [selectedItem, setSelectedItem] = useState(items.length > 0 ? items[0] : { label: 'Select Medium', value: '' });

  useEffect(() => {
    // Reset selectedItem to the first item whenever items change
    if (items.length > 0) {
      const initialItem = items[0];
      setSelectedItem(initialItem);
      const mediumObject = initialItem.value ? initialItem : (initialItem.options && initialItem.options[0]);
      if (mediumObject !== mainInfo.medium) {
        setMainInfo(prevMainInfo => ({
          ...prevMainInfo,
          medium: mediumObject
        }));
      }
    } else {
      setSelectedItem({ label: 'Select Medium', value: '' });
    }
  }, [items]); // Removed setMainInfo and mainInfo from dependency array

  const handleSelect = (item) => {
    setSelectedItem(item);
    const mediumObject = item.value ? item : (item.options && item.options[0]);
    setMainInfo(prevMainInfo => ({
      ...prevMainInfo,
      medium: mediumObject
    }));
  };

  return (
    <div className="my-2">
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          {selectedItem.label}
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
          mainInfo={mainInfo} // Pass down mainInfo as well
          setMainInfo={setMainInfo}
        />
      )}
    </div>
  );
}

export default MediumSelect;
