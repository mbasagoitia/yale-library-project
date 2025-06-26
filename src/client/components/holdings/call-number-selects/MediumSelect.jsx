import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

function MediumSelect({ items, handleItemSelect, depth = 0, resetKey }) {
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setSelectedItem(null);
  }, [resetKey]);

  useEffect(() => {
    if (!selectedItem && items.length > 0) {
      setSelectedItem(items[0])
    }
  }, [items]);

  const handleSelect = (item) => {
    setSelectedItem(item);
  
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
        {selectedItem?.label || 'Select Ensemble Type'}
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
    const nestedItems = selectedItem?.options || selectedItem?.nested_options;
    if (nestedItems?.length) {
      return (
        <MediumSelect
          key={selectedItem.label}
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
