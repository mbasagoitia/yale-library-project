import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

const MediumSelect = ({ items, handleItemSelect, depth = 0, resetKey }) => {
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    setCurrentItem(null);
  }, [resetKey]);

  useEffect(() => {
    if (!currentItem && items.length > 0) {
      setCurrentItem(items[0])
    }
  }, [items]);

  const handleSelect = (item) => {
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
          key={currentItem.label}
          items={nestedItems}
          handleItemSelect={handleItemSelect}
          depth={depth + 1}
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
}

export default MediumSelect;