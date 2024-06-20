import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

function MediumSelect({ items, mainInfo, setMainInfo }) {
  const [selectedItem, setSelectedItem] = useState(null);
  console.log(items);

  // Handle selection of an item
  const handleSelect = (item) => {
    setSelectedItem(item);
    setMainInfo(prevMainInfo => ({
      ...prevMainInfo,
      medium: item
    }));
  };

  // Render dropdown menu
  const renderDropdown = (options) => (
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        {selectedItem ? selectedItem.label : 'Select Option'}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {options.map((item, index) => (
          <Dropdown.Item key={index} onClick={() => handleSelect(item)}>
            {item.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );

  // Render nested MediumSelect component recursively
  // if (selectedItem && (selectedItem.options || selectedItem.nested_options)  && (selectedItem.options.length > 0 || selectedItem.nested_options.length > 0))
  const renderNestedMediumSelect = () => {
    if (selectedItem && ((selectedItem.options && selectedItem.options.length > 0) || (selectedItem.nested_options && selectedItem.nested_options.length > 0))) {
      return (
        <div>
          <MediumSelect
            key={selectedItem.label} // Ensure key is unique
            items={selectedItem.options || selectedItem.nested_options}
            mainInfo={mainInfo}
            setMainInfo={setMainInfo}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="my-2">
      {renderDropdown(items)}
      {renderNestedMediumSelect()}
    </div>
  );
}

export default MediumSelect;
