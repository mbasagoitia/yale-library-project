import { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { BiFilter } from 'react-icons/bi';
import FilterInput from "./FilterInput";

const BasicFilter = ({ setAdvancedFilter }) => {

    const [title, setTitle] = useState("");
    const [composer, setComposer] = useState("");

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const onComposerChange = (e) => {
        setComposer(e.target.value);
    }

    return (
        <Form className="basic-filter">
            <Row className="mb-4">
                <Col>
                    <FilterInput placeholder={"Title"} value={title} onChange={onTitleChange} />
                </Col>
                <Col xs={{ order: 3 }} sm={{ order: 2, span: 5 }} className="mt-1 mt-sm-0 d-flex">
                    <FilterInput placeholder={"Composer"} value={composer} onChange={onComposerChange} />
                    <Button className="w-auto" type="submit"><i className="fa fa-search"></i></Button>
                </Col>
                <Col xs={{ order: 1 }} sm={{ order: 3, span: 2 }} className="d-flex flex-column justify-content-center mb-4 mb-sm-0">
                <div className="open-advanced-filter" onClick={() => setAdvancedFilter(true)}>
                    <BiFilter size={20} />
                    <span className="advanced-filter-text">Advanced Filter</span>
                </div>
                </Col>
            </Row>
        </Form>
    )
}

export default BasicFilter;