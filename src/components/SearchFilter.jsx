import { useState, useEffect } from 'react';
import { InputGroup, FormControl, Dropdown } from 'react-bootstrap';

const SearchFilter = ({ items, onItemClick }) => {
  const [filteredItems, setFilteredItems] = useState(items);
  const [searchText, setSearchText] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Open the dropdown when typing in the search bar
    if (searchText !== "") {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  }, [searchText]);

  const handleInputChange = (value) => {
    setSearchText(value);
    filterItems(value);
  };

  const filterItems = (value) => {
    const lowerCaseValue = value.toLowerCase();
    const filtered = items.map(category => ({
      ...category,
      options: category.options.filter(option =>
        option.label.toLowerCase().includes(lowerCaseValue)
      )
    })).filter(category => category.options.length > 0);
    setFilteredItems(filtered);
  };

  const handleItemClick = (item) => {
    setSelectedItemId(item.value);
    onItemClick(item);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isItemSelected = (item) => {
    return item.value === selectedItemId;
  };

  return (
    <div className="searchableList">
      <div className="searchBar">
        <InputGroup>
          <FormControl
            placeholder="Search..."
            aria-label="Search"
            aria-describedby="searchBar"
            onChange={(e) => handleInputChange(e.target.value)}
            onClick={handleDropdownClick}
          />
        </InputGroup>
      </div>
      {isDropdownOpen && (
        <Dropdown.Menu className="custom-dropdown-menu" show>
          {filteredItems.map((category) => (
            <div key={category.label}>
              <Dropdown.Header>{category.label}</Dropdown.Header>
              {category.options.map((item) => (
                <Dropdown.Item
                  key={item.value}
                  onClick={() => handleItemClick(item)}
                  active={isItemSelected(item)}
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
