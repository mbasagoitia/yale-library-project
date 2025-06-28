import React, { useState, useEffect, useRef } from 'react';
import { InputGroup, FormControl, Dropdown } from 'react-bootstrap';
import filterItems from '../../helpers/general/filterItems';

const SearchFilter = ({ initialValue, items, selectedItem, onItemClick }) => {
  const [searchText, setSearchText] = useState(initialValue || '');
  const [filteredItems, setFilteredItems] = useState(items);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (selectedItem) {
      setSearchText(selectedItem.label);
    } else {
      setSearchText('');
    }
  }, [selectedItem]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleInputChange = (value) => {
    setSearchText(value);
    setFilteredItems(filterItems(value, items));
    setIsDropdownOpen(true);

    if (value === '') {
      onItemClick(null);
    }
  };

  const handleDropdownItemClick = (item) => {
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
            value={searchText}
            onChange={(e) => handleInputChange(e.target.value)}
            onClick={() => setIsDropdownOpen(true)}
          />
        </InputGroup>
      </div>

      {isDropdownOpen && (
        <Dropdown.Menu className="custom-dropdown-menu" show>
          {filteredItems.map((category, idx) => (
            <div key={category.label + idx}>
              <Dropdown.Header>{category.label}</Dropdown.Header>
              {category.options.map((item, itemIdx) => (
                <Dropdown.Item
                  key={`${itemIdx + item.label}`}
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
