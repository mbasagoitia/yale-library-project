import { useState } from "react";
import { Form, FormControl, Button, InputGroup } from "react-bootstrap";

const Searchbar = ({ placeholder, onSearch }) => {
  const [searchText, setSearchText] = useState("");
  // Start here; see where I've imported this (navbar is one) and define onSearch
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchText);
  };

  return (
    <Form className="mb-4 d-inline" onSubmit={handleSubmit}>
      <InputGroup className="search-wrapper">
        <InputGroup.Text className="rounded-pill-left">
          <Button type="submit" variant="outline-primary" className="search-button">
            <i className="fa fa-search"></i>
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
