import { Form, FormControl } from "react-bootstrap";

const FilterInput = ({ placeholder, value, onChange, className }) => {
    return (
        <div className="d-inline">
            <FormControl type="text" placeholder={placeholder} value={value} onChange={onChange} className={`filter-input ${className}`} />
        </div>
    )
}

export default FilterInput;