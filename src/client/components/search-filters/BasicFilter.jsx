import { Row, Col } from "react-bootstrap";
import { BiFilter } from 'react-icons/bi';
import FilterInput from "./FilterInput";

const BasicFilter = ({ setAdvancedFilter, searchCriteria, setSearchCriteria }) => {

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

    return (
        <div className="basic-filter">
            <Row className="mb-2 d-flex justify-content-between">
                <div className="basic-filter-input">
                    <FilterInput 
                            placeholder={"Title"}
                            value={searchCriteria.title}
                            onChange={onTitleChange}
                        />
                </div>
                <div className="open-advanced-filter" onClick={() => setAdvancedFilter(true)}>
                    <BiFilter size={20} />
                    <div className="filter-text ms-2">Advanced Filter</div>
                </div>
            </Row>
            <Row>
                <Col xs={9}>
                <div className="d-flex w-100">
                    <div className="flex-grow-1">
                    <FilterInput
                        placeholder="Composer"
                        value={searchCriteria.composer}
                        onChange={onComposerChange}
                        className={"rounded-corners-left"}
                    />
                    </div>
                </div>
                </Col>
            </Row>
        </div>
    )
}

export default BasicFilter;