import { useState, useEffect } from "react";
import generateCallNum from "../../../helpers/holdings/generateCallNum.js";
import { Dropdown, ButtonGroup, Button, InputGroup, FormControl, Form } from "react-bootstrap";
import Tooltip from "../../holdings/Tooltip.jsx";
import ValueTooltip from "../../holdings/tooltip-contents/ValueTooltip.jsx";
import NumberTooltip from "../../holdings/tooltip-contents/NumberTooltip.jsx";


const IdAndNumber = ({ mainInfo, setMainInfo }) => {
  const identifiers = ["Op.", "KV", "BWV", "Hob", "HWV", "D.", "Other"];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(identifiers[0]);
  const [otherIdInputRequired, setOtherIdInputRequired] = useState(false);

  useEffect(() => {
    if (mainInfo?.identifierLabel) {
      setSelectedItem(mainInfo.identifierLabel);
    } else {
      setSelectedItem(identifiers[0]);
    }
  }, [mainInfo, identifiers])

  const handleIdLabelChange = (e) => {
    setMainInfo(prev => {
      const updated = { ...prev, identifierLabel: e.target.value };
      const call = generateCallNum(updated);
      return { ...updated, callNumber: call };
    });
  }

  const handleIdValueChange = (e) => {
    setMainInfo(prev => {
      const updated = { ...prev, identifierValue: e.target.value };
      const call = generateCallNum(updated);
      return { ...updated, callNumber: call };
    });
  };

  const handleNumberChange = (e) => {
    setMainInfo(prev => {
      const updated = { ...prev, number: e.target.value };
      const call = generateCallNum(updated);
      return { ...updated, callNumber: call };
    });
  };

  const isItemSelected = (item) => {
    return item === selectedItem;
  };

  const handleDropdownItemClick = (item) => {
    if (item === "Other") {
      setOtherIdInputRequired(true);
      setMainInfo(prev => {
        const updated = { ...prev, identifierLabel: '' };
        const call = generateCallNum(updated);
        return { ...updated, callNumber: call };
      });
    } else {
      setOtherIdInputRequired(false);
      setMainInfo(prev => {
        const updated = { ...prev, identifierLabel: item };
        const call = generateCallNum(updated);
        return { ...updated, callNumber: call };
      });
    }
  
    setSelectedItem(item);
    setIsDropdownOpen(false);
  };  

  const handleReopenDropdown = () => {
    setOtherIdInputRequired(false);
    setIsDropdownOpen(true);
  };

  return (
    <div className="d-flex justify-content-between mt-4 mt-md-0">
      <div className="d-flex flex-column justify-content-end id-num-col">
        {otherIdInputRequired ? (
          <>
            <Form.Label htmlFor="identifierLabelInput">Identifier:</Form.Label>
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
                  value={mainInfo.identifierLabel || ''}
                  onChange={handleIdLabelChange}
                />
            </InputGroup>
          </>
        ) : (
          <>
            <Form.Label htmlFor="identifierLabelInput">Identifier:</Form.Label>
            <Dropdown show={isDropdownOpen} onToggle={() => setIsDropdownOpen(!isDropdownOpen)}>
              <Dropdown.Toggle id="identifierLabelInput" className="identifier-dropdown">
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
          </>
        )}
      </div>
      <div className="id-num-col">
        <label htmlFor="identifierValueInput" className="form-label">Value: <Tooltip content={<ValueTooltip />} /></label>
        <input
          type="number"
          className="form-control"
          id="identifierValueInput"
          value={mainInfo.identifierValue}
          onChange={handleIdValueChange}
        />
      </div>
      <div className="id-num-col">
        <label htmlFor="numberInput" className="form-label">No: <Tooltip content={<NumberTooltip />} /></label>
        <input
          type="number"
          className="form-control"
          id="numberInput"
          value={mainInfo.number}
          onChange={handleNumberChange}
        />
      </div>
    </div>
  );
};

export default IdAndNumber;
