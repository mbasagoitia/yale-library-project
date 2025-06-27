import React, { useState, useEffect, useRef } from 'react';
import { InputGroup, FormControl, Dropdown } from 'react-bootstrap';
import filterItems from '../../helpers/general/filterItems';

const SearchFilter = ({ initialValue, items, onItemClick }) => {
  const [filteredItems, setFilteredItems] = useState(items);
  const [searchText, setSearchText] = useState(initialValue || '');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    if (!initialValue) {
      setSearchText('');
      setSelectedItemId(null);
    }
  }, [initialValue]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleInputChange = (value) => {
    setSearchText(value);
    setFilteredItems(filterItems(value, items));
  
    if (value === '') {
      setSelectedItemId(null);
      setSearchText('');
      onItemClick(null);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownItemClick = (item) => {
    setSelectedItemId(item.value);
    setSearchText(item.label);
    onItemClick(item);
    setIsDropdownOpen(false);
  };
  
  return (
    <div className="searchableList" ref={dropdownRef}>
      <div className="searchBar">
        <InputGroup>
          <FormControl
            placeholder="Search..."
            aria-label="Search"
            aria-describedby="searchBar"
            value={searchText || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            onClick={toggleDropdown}
          />
        </InputGroup>
      </div>
      {isDropdownOpen && (
        <Dropdown.Menu className="custom-dropdown-menu" show>
          {filteredItems.map((category, idx) => (
            <div key={category.label + idx}>
              <Dropdown.Header>{category.label}</Dropdown.Header>
              {category.options.map((item, idx) => (
                <Dropdown.Item
                  key={`${idx + item.label}`}
                  onClick={() => handleDropdownItemClick(item)}
                >
                  {item.label}
                </Dropdown.Item>
              ))}
            </div>
          ))}
        </Dropdown.Menu>
      )}
    </div>
  );
};

export default SearchFilter;
