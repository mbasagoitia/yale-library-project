import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

const MediumSelect = ({ initialValue, items, handleItemSelect, resetKey }) => {
  const [currentItem, setCurrentItem] = useState(initialValue);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  // Update the current item only when resetKey changes, but preserve user interaction
  useEffect(() => {
    if (resetKey && !userHasInteracted) {
      setCurrentItem(initialValue || items[0]); // Reset to initialValue or the first item
    }
  }, [resetKey, initialValue, items, userHasInteracted]);

  const handleSelect = (item) => {
    setUserHasInteracted(true); // Mark user interaction
    setCurrentItem(item); // Set current item to the selected one

    const getFirstLeaf = (node) => {
      if (node.options?.length) return getFirstLeaf(node.options[0]);
      if (node.nested_options?.length) return getFirstLeaf(node.nested_options[0]);
      return node;
    };

    const leaf = getFirstLeaf(item);
    handleItemSelect(leaf);
  };

  const renderDropdown = () => (
    <Dropdown className="my-2">
      <Dropdown.Toggle variant="primary" id="medium-dropdown" className="p-2">
        {currentItem?.label || 'Select Ensemble Type'}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {items.map((item, index) => (
          <Dropdown.Item key={index} onClick={() => handleSelect(item)}>
            {item.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );

  const renderNestedMediumSelect = () => {
    const nestedItems = currentItem?.options || currentItem?.nested_options;
    if (nestedItems?.length) {
      return (
        <MediumSelect
          initialValue={initialValue}
          key={currentItem.label}
          items={nestedItems}
          handleItemSelect={handleItemSelect}
          resetKey={resetKey} // Ensure resetKey is passed down to nested component
        />
      );
    }
    return null;
  };

  return (
    <div>
      {renderDropdown()}
      {renderNestedMediumSelect()}
    </div>
  );
};

export default MediumSelect;
