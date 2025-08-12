import React, { useState, useEffect, useRef } from 'react';
import { InputGroup, FormControl, Dropdown } from 'react-bootstrap';
import filterComposerItems from '../../helpers/holdings/filterComposerItems';
import "../../../assets/styles/components/SearchFilter.css";

const ComposerFilter = ({ initialValue, items, onItemClick }) => {
  
  const [filteredItems, setFilteredItems] = useState(items);
  const [searchText, setSearchText] = useState(initialValue || '');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSearchText(initialValue || '');
  }, [initialValue]);

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleInputChange = (value) => {
    setSearchText(value);
    setFilteredItems(filterComposerItems(value, items));
    setIsDropdownOpen(true);
  };

  const handleDropdownItemClick = (item) => {
    setSelectedItemId(item.id);
    setSearchText(`${item.last_name}, ${item.first_name}`);
    onItemClick(item);
    setIsDropdownOpen(false);
  };

  const isItemSelected = (item) => {
    return item.id === selectedItemId;
  };

  return (
    <div className="searchableList" ref={dropdownRef}>
      <div className="searchBar">
        <InputGroup>
          <FormControl
            placeholder="Search..."
            aria-label="Search"
            aria-describedby="searchBar"
            value={searchText}
            onChange={(e) => handleInputChange(e.target.value)}
            onClick={() => setIsDropdownOpen(true)}
            id="composer-select"
          />
        </InputGroup>
      </div>
      {isDropdownOpen && (
        <Dropdown.Menu className="custom-dropdown-menu" show>
          {filteredItems.map((item) => (
            <Dropdown.Item
              key={item.id}
              onClick={() => handleDropdownItemClick(item)}
              active={isItemSelected(item)}
            >
              {`${item.last_name}, ${item.first_name}`}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      )}
    </div>
  );
};

export default ComposerFilter;
