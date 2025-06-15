import { Form, FormControl, Button, InputGroup } from "react-bootstrap";

const Searchbar = ({ placeholder, onSubmit }) => {
    return (
        <Form className="mb-4 d-inline" onSubmit={onSubmit}>
            <InputGroup className="search-wrapper">
                <InputGroup.Text className="rounded-pill-left">
                <Button type="submit" variant="outline-secondary" className="search-button">
                        <i className="fa fa-search"></i>
                    </Button>
                </InputGroup.Text>
                <FormControl type="text" placeholder={placeholder} className="rounded-pill-right" />
            </InputGroup>
        </Form>
    )
}

export default Searchbar;