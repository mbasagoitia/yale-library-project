import { Form, FormControl } from "react-bootstrap";

const FilterInput = ({ placeholder, value, onChange }) => {
    return (
        <Form className="d-inline">
            <FormControl type="text" placeholder={placeholder} value={value} onChange={onChange} />
        </Form>
    )
}

export default FilterInput;