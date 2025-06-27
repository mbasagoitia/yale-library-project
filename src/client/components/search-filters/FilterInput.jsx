import { FormControl } from "react-bootstrap";
    
const FilterInput = ({ placeholder, value, onChange, className = "" }) => {
  return (
    <FormControl
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`filter-input ${className}`}
    />
  );
};

export default FilterInput;
