import { useState } from "react";
import { Form, FormControl, Button, InputGroup } from "react-bootstrap";
import { FaSearch } from 'react-icons/fa';
import "../../../assets/styles/components/SearchBar.css";

const Searchbar = ({ placeholder, onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchText);
  };

  return (
    <Form className="mb-4 d-inline" onSubmit={handleSubmit}>
      <InputGroup className="search-wrapper">
        <InputGroup.Text className="rounded-pill-left">
          <Button type="submit" variant="outline-primary" className="search-button">
            <FaSearch size={12} className="search-icon" />
          </Button>
        </InputGroup.Text>
        <FormControl
          type="text"
          placeholder={placeholder}
          className="rounded-pill-right"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </InputGroup>
    </Form>
  );
};

export default Searchbar;
