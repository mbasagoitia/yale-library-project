import { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import MediumSelect from "./call-number-selects/MediumSelect";
import SpeciesSelect from "./call-number-selects/SpeciesSelect";
import PublisherSelect from "./call-number-selects/PublisherSelect";
import fetchResourceData from "../helpers/fetchResourceData";
import { BiFilter } from 'react-icons/bi';
import FilterInput from "./FilterInput";

const AdvancedFilter = ({ setAdvancedFilter }) => {

    const [searchCriteria, setSearchCriteria] = useState({
        title: "",
        composer: "",
        medium: {},
        genre: {},
        publisher: {}
    });

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

    // Also add handlers for medium, genre, publisher

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const [resourceData, setResourceData] = useState({
        mediumData: [],
        composerData: [],
        speciesData: [],
        publisherData: [],
      });

    useEffect(() => {
        const fetchData = async () => {
            try {
              const resources = await fetchResourceData();
      
              setResourceData({ 
                mediumData: resources[0],
                composerData: resources[1],
                speciesData: resources[2],
                publisherData: resources[3]
               });
            } catch (error) {
              console.error("Error fetching resource data:", error);
            }
          }
          fetchData();
      }, [])
    
    return (
        <Form className="advanced-filter" onSubmit={handleSubmit}>
        <Row>
            <Col className="d-flex justify-content-between">
                <span>Filter By:</span>
                <div className="open-basic-filter" onClick={() => setAdvancedFilter(false)}>
                    <BiFilter size={20} />
                    <span className="advanced-filter-text">Basic Filter</span>
                </div>
            </Col>
            <span className="reset-text mt-2">Reset</span>
        </Row>
        <Row className="mt-2 mb-3">
            <Col>
                <Button className="w-auto" type="submit"><i className="fa fa-search"></i></Button>
            </Col>
        </Row>
            <div className="holdings-filter mt-2">
                <Row className="mb-4">
                    <Col md={6}>
                        <Form.Label>Title</Form.Label>
                        <FilterInput placeholder={"Symphony no. 1"} value={searchCriteria.title} onChange={onTitleChange} />
                    </Col>
                    <Col md={6}>
                        <Form.Label>Composer</Form.Label>
                        <FilterInput placeholder={"Shostakovich"} value={searchCriteria.composer} onChange={onComposerChange} />
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                    <div className="mb-4 mt-4 mt-md-0">
                        <Form.Label>Publisher</Form.Label>
                        {resourceData.publisherData.length > 0 && <PublisherSelect items={resourceData.publisherData} />}
                    </div>
                    </Col>
                    <Col md={6}>
                    <div>
                        <Form.Label>Genre</Form.Label>
                        {resourceData.speciesData.length > 0 && <SpeciesSelect items={resourceData.speciesData} />}    
                    </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Label>Ensemble Type</Form.Label>
                        {resourceData.mediumData.length > 0 && <MediumSelect items={resourceData.mediumData} />}
                    </Col>
                </Row>
            </div>
        </Form>
    )
}

export default AdvancedFilter;