import { useState } from "react";
import { Col, Dropdown, ButtonGroup, Button, InputGroup, FormControl } from "react-bootstrap";

const IdAndNumber = ({ mainInfo, setMainInfo }) => {
  const identifiers = ["Op.", "KV", "BWV", "Hob", "HWV", "D.", "Other"];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(identifiers[0]);
  const [otherIdInputRequired, setOtherIdInputRequired] = useState(false);

  const handleIdLabelChange = (e) => {
    setMainInfo({ ...mainInfo, identifierLabel: e.target.value });
  };

  const handleIdValueChange = (e) => {
    setMainInfo({ ...mainInfo, identifierValue: e.target.value });
  };

  const handleNumberChange = (e) => {
    setMainInfo({ ...mainInfo, number: e.target.value });
  };

  const isItemSelected = (item) => {
    return item === selectedItem;
  };

  const handleDropdownItemClick = (item) => {
    if (item === "Other") {
      setOtherIdInputRequired(true);
      setMainInfo({ ...mainInfo, identifierLabel: '' });
    } else {
      setOtherIdInputRequired(false);
      setMainInfo({ ...mainInfo, identifierLabel: item });
    }
    setSelectedItem(item);
    setIsDropdownOpen(false);
  };

  const handleReopenDropdown = () => {
    setOtherIdInputRequired(false);
    setIsDropdownOpen(true);
  };

  return (
    <>
      <Col md={2} className="my-2 my-md-0 d-flex flex-column justify-content-end">
        {otherIdInputRequired ? (
          <>
            <label htmlFor="identifierLabelInput" className="form-label">Identifier:</label>
            <InputGroup>
            <ButtonGroup>
                <Button onClick={handleReopenDropdown} className="reopen-dropdown-btn">
                  <span className="dropdown-toggle"></span>
                </Button>
              </ButtonGroup>
              <FormControl
                type="text"
                className="form-control"
                id="identifierLabelInput"
                value={mainInfo.identifierLabel}
                onChange={handleIdLabelChange}
              />
            </InputGroup>
          </>
        ) : (
          <Dropdown show={isDropdownOpen} onToggle={() => setIsDropdownOpen(!isDropdownOpen)}>
            <Dropdown.Toggle id="dropdown-basic">
              {selectedItem || identifiers[0]}
            </Dropdown.Toggle>
            <Dropdown.Menu className="identifier-dropdown-menu">
              {identifiers.map((identifier, idx) => (
                <Dropdown.Item
                  key={`identifier-${idx}`}
                  onClick={() => handleDropdownItemClick(identifier)}
                  active={isItemSelected(identifier)}
                >
                  {identifier}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Col>
      <Col md={2} className="mb-2 mb-md-0">
        <label htmlFor="identifierValueInput" className="form-label">Value:</label>
        <input
          type="text"
          className="form-control"
          id="identifierValueInput"
          value={mainInfo.identifierValue}
          onChange={handleIdValueChange}
        />
      </Col>
      <Col md={2}>
        <label htmlFor="numberInput" className="form-label">No:</label>
        <input
          type="number"
          className="form-control"
          id="numberInput"
          value={mainInfo.number}
          onChange={handleNumberChange}
        />
      </Col>
    </>
  );
};

export default IdAndNumber;
