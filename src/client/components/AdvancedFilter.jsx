import { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import MediumSelect from "./call-number-selects/MediumSelect";
import SpeciesSelect from "./call-number-selects/SpeciesSelect";
import PublisherSelect from "./call-number-selects/PublisherSelect";
import fetchResourceData from "../helpers/fetchResourceData";
import { BiFilter } from 'react-icons/bi';
import FilterInput from "./FilterInput";

const AdvancedFilter = ({ setAdvancedFilter, searchCriteria, setSearchCriteria }) => {

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
                    <span className="advanced-filter-text" onClick={clearSearchCriteria}>Basic Filter</span>
                </div>
            </Col>
            <span className="reset-text mt-2">Reset</span>
        </Row>
            <div className="holdings-filter mt-2">
                <Row className="mb-0 mb-md-4">
                    <Col md={6} className="my-2 my-md-0">
                        <Form.Label>Title</Form.Label>
                        <FilterInput placeholder={"Symphony no. 1"} value={searchCriteria.title} onChange={onTitleChange} />
                    </Col>
                    <Col md={6} className="my-2 my-md-0">
                        <Form.Label>Composer</Form.Label>
                        <FilterInput placeholder={"Shostakovich"} value={searchCriteria.composer} onChange={onComposerChange} />
                    </Col>
                </Row>
                <Row>
                    <Col md={6} className="my-2 my-md-0">
                        <Form.Label>Publisher</Form.Label>
                        {resourceData.publisherData.length > 0 && <PublisherSelect items={resourceData.publisherData} />}
                    </Col>
                    <Col md={6} className="my-2 my-md-0">
                        <Form.Label>Genre</Form.Label>
                        {resourceData.speciesData.length > 0 && <SpeciesSelect items={resourceData.speciesData} />}    
                    </Col>
                </Row>
                <Row className="my-0 my-md-4">
                    <Col md={6} className="my-2 my-md-0">
                        <Form.Label>Ensemble Type</Form.Label>
                        {resourceData.mediumData.length > 0 && <MediumSelect items={resourceData.mediumData} />}
                    </Col>
                </Row>
                <Row className="mt-1 mb-3">
                    <Col className="d-flex justify-content-center">
                        <Button type="submit">Search</Button>
                    </Col>
                </Row>
            </div>
        </Form>
    )
}

export default AdvancedFilter;