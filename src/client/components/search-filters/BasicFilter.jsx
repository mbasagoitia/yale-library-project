import { Row, Col } from "react-bootstrap";
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
        <div className="basic-filter mb-4">
            <Row className="mb-2 d-flex justify-content-between">
                <Col>
                <div className="basic-filter-input mb-2">
                    <FilterInput 
                            placeholder={"Title"}
                            value={searchCriteria.title}
                            onChange={onTitleChange}
                        />
                </div>
                <div className="d-flex w-100">
                    <div className="flex-grow-1">
                    <FilterInput
                        placeholder="Composer"
                        value={searchCriteria.composer}
                        onChange={onComposerChange}
                        className={"rounded-corners"}
                    />
                    </div>
                </div>
                </Col>
            </Row>
        </div>
    )
}

export default BasicFilter;