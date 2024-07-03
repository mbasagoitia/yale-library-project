import { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { BiFilter } from 'react-icons/bi';
import FilterInput from "./FilterInput";

const BasicFilter = ({ setAdvancedFilter, searchCriteria, setSearchCriteria }) => {

    const [title, setTitle] = useState("");
    const [composer, setComposer] = useState("");

    const clearSearchCriteria = () => {
        setSearchCriteria({
            title: "",
            composer: "",
            medium: {},
            genre: {},
            publisher: {}
        });
    }

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const onComposerChange = (e) => {
        setComposer(e.target.value);
    }

    return (
        <Form className="basic-filter">
            <Row className="mb-4">
                <Col xs={{ order: 2 }} sm={{ order: 1, span: 5 }}>
                    <FilterInput placeholder={"Title"} value={title} onChange={onTitleChange} />
                </Col>
                <Col xs={{ order: 3 }} sm={{ order: 2, span: 5 }} className="mt-1 mt-sm-0">
                    <div className="d-flex w-100">
                        <div className="flex-grow-1">
                        <FilterInput
                            placeholder="Composer"
                            value={composer}
                            onChange={onComposerChange}
                            className={"rounded-corners-left"}
                        />
                        </div>
                        <Button className="flex-shrink-0 rounded-corners-right basic-filter-search" type="submit">
                            <i className="fa fa-search"></i>
                        </Button>
                    </div>
                </Col>
                <Col xs={{ order: 1 }} sm={{ order: 3, span: 2 }} className="d-flex flex-column mb-4 mb-sm-0">
                <div className="open-advanced-filter" onClick={() => setAdvancedFilter(true)}>
                    <BiFilter size={20} />
                    <span className="advanced-filter-text" onClick={clearSearchCriteria}>Advanced Filter</span>
                </div>
                </Col>
            </Row>
        </Form>
    )
}

export default BasicFilter;