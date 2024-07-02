import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

function MediumSelect({ items, mainInfo, setMainInfo, onItemClick, initialSelectionMade }) {
  const [selectedItem, setSelectedItem] = useState(items[0]);

  useEffect(() => {
    if (mainInfo && !mainInfo.medium.id) {
      setMainInfo(prevMainInfo => ({
        ...prevMainInfo,
        medium: selectedItem
      }));
    }
  }, []);

  useEffect(() => {
    if (mainInfo?.medium?.id && !initialSelectionMade) {
      setSelectedItem(mainInfo.medium);
    }
  }, []);

  const handleSelect = (item) => {
    setSelectedItem(item);
    onItemClick(item);
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
            onItemClick={onItemClick}
            initialSelectionMade={true}
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
