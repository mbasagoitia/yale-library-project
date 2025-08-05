import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

const MediumSelect = ({ initialValue, items, handleItemSelect, depth = 0, resetKey }) => {
  const [currentItem, setCurrentItem] = useState(initialValue);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  // Set first item if no current or initial
  useEffect(() => {
    console.log("inital", initialValue, "currentItem", currentItem);
    if (!initialValue && !currentItem && items.length > 0) {
      setCurrentItem(items[0]);
    }
  }, [items]);
  // Update currentItem if initialValue changes, unless user already selected
  useEffect(() => {
    if (!userHasInteracted && initialValue) {
      setCurrentItem(initialValue);
    }
  }, [initialValue, userHasInteracted]);

  const handleSelect = (item) => {
    setUserHasInteracted(true);
    setCurrentItem(item);

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
      <Dropdown.Toggle variant="primary" id={`dropdown-${depth}`} className="p-2">
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
          depth={depth + 1}
          resetKey={resetKey}
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
