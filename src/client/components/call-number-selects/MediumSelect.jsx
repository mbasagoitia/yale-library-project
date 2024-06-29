import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

function MediumSelect({ items, mainInfo, setMainInfo }) {
  // Now the bug is that each nested dropdown defaults to mainInfo.medium... hmmm
  // Also need to finish resetting composer, genre and publisher if there is intial data
  const [selectedItem, setSelectedItem] = useState(mainInfo.medium || items[0]);

  useEffect(() => {
    if (!mainInfo.medium) {
      setMainInfo(prevMainInfo => ({
        ...prevMainInfo,
        medium: selectedItem
      }));
    }
  }, [selectedItem]);

  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  const renderDropdown = (options) => (
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        {selectedItem.label}
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

  const renderNestedMediumSelect = () => {
    if (selectedItem && ((selectedItem.options && selectedItem.options.length > 0) || (selectedItem.nested_options && selectedItem.nested_options.length > 0))) {
      return (
        <div>
          <MediumSelect
            key={selectedItem.label}
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
