import { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { BiFilter } from 'react-icons/bi';
import FilterInput from "./FilterInput";

const BasicFilter = ({ setAdvancedFilter, searchCriteria, setSearchCriteria, onSubmit }) => {

    // This needs to be a slice of redux state!

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
        setSearchCriteria({
            ...searchCriteria,
            title: e.target.value
        });
    }

    const onComposerChange = (e) => {
        setSearchCriteria({
            ...searchCriteria,
            composer: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    }

    return (
        <Form className="basic-filter" onSubmit={handleSubmit}>
            <Row className="mb-4">
                <Col xs={{ order: 2 }} sm={{ order: 1, span: 5 }}>
                    <FilterInput 
                        placeholder={"Title"}
                        value={searchCriteria.title}
                        onChange={onTitleChange}
                    />
                </Col>
                <Col xs={{ order: 3 }} sm={{ order: 2, span: 5 }} className="mt-1 mt-sm-0">
                    <div className="d-flex w-100">
                        <div className="flex-grow-1">
                        <FilterInput
                            placeholder="Composer"
                            value={searchCriteria.composer}
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