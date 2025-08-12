import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

const MediumSelect = ({ initialValue, items, handleItemSelect, resetKey }) => {
  const [currentItem, setCurrentItem] = useState(initialValue); // Track the currently selected item for the top-level dropdown
  const [selectionHistory, setSelectionHistory] = useState([initialValue]); // Track the selection history for each level
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  // Update the current item only when resetKey changes or the initialValue changes, but preserve user interaction


  useEffect(() => {
    if (resetKey && !userHasInteracted) {
      setSelectionHistory([initialValue || items[0]]); // Reset to initialValue or first item
      setCurrentItem(initialValue || items[0]); // Ensure the top-level dropdown resets correctly
      setUserHasInteracted(false); // Reset user interaction flag
    }
  }, [resetKey, initialValue, items, userHasInteracted]);

  // Update the state if initialValue changes after user interaction
  useEffect(() => {
    if (!userHasInteracted) {
      setSelectionHistory([initialValue || items[0]]);
      setCurrentItem(initialValue || items[0]);
    }
  }, [initialValue, userHasInteracted, items]);

  const handleSelect = (item, level) => {
    const updatedHistory = [...selectionHistory.slice(0, level), item]; // Update selection history for this level
    setUserHasInteracted(true); // Mark user interaction
    setSelectionHistory(updatedHistory); // Set the updated selection history
    setCurrentItem(item); // Update the current item to the selected one

    const getFirstLeaf = (node) => {
      if (node.options?.length) return getFirstLeaf(node.options[0]);
      if (node.nested_options?.length) return getFirstLeaf(node.nested_options[0]);
      return node;
    };

    const leaf = getFirstLeaf(item);
    handleItemSelect(leaf); // Propagate the selected item to parent
  };

  // Render a dropdown for the current level and its nested items, if applicable
  const renderDropdowns = (items, level = 0) => {
    if (!items || items.length === 0) return null;

    const currentSelection = selectionHistory[level];
    // Set the first item as the initial value for each nested dropdown
    const initialItemForLevel = items[0];

    return (
      <Dropdown key={level} className="my-2" id="medium-select">
        <Dropdown.Toggle variant="primary" id={`medium-dropdown-${level}`} className="p-2">
          {currentSelection?.label || (level === 0 ? 'Select Ensemble Type' : initialItemForLevel.label)}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {items.map((item, index) => (
            <Dropdown.Item key={index} onClick={() => handleSelect(item, level)}>
              {item.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
        {currentSelection?.options || currentSelection?.nested_options ? (
          // Render the nested dropdowns if there are options or nested_options
          renderDropdowns(currentSelection.options || currentSelection.nested_options, level + 1)
        ) : null}
      </Dropdown>
    );
  };

  return (
    <div>
      {renderDropdowns(items)}
    </div>
  );
};

export default MediumSelect;
