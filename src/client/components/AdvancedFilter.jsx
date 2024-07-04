import { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import MediumSelect from "./call-number-selects/MediumSelect";
import SpeciesSelect from "./call-number-selects/SpeciesSelect";
import PublisherSelect from "./call-number-selects/PublisherSelect";
import fetchResourceData from "../helpers/fetchResourceData";
import { BiFilter } from 'react-icons/bi';
import FilterInput from "./FilterInput";

const AdvancedFilter = ({ setAdvancedFilter, searchCriteria, setSearchCriteria, onSubmit }) => {

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

    // Need to add an option to show medium selects, and if they are shown, set an inital state (first item)
    // Because the user may not want to use that filter and it should not be included in some cases
    const onMediumSelect = (item) => {
        setSearchCriteria({
            ...searchCriteria,
            medium: item
        });
    }

    const onGenreSelect = (item) => {
        setSearchCriteria({
            ...searchCriteria,
            genre: item
        });
    }

    const onPublisherSelect = (item) => {
        setSearchCriteria({
            ...searchCriteria,
            publisher: item
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
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
                        {resourceData.publisherData.length > 0 && <PublisherSelect items={resourceData.publisherData} onItemClick={onPublisherSelect} />}
                    </Col>
                    <Col md={6} className="my-2 my-md-0">
                        <Form.Label>Genre</Form.Label>
                        {resourceData.speciesData.length > 0 && <SpeciesSelect items={resourceData.speciesData} onItemClick={onGenreSelect} />}    
                    </Col>
                </Row>
                <Row className="my-0 my-md-3">
                    <Col md={6} className="my-2 my-md-0">
                        <Form.Label>Ensemble Type</Form.Label>
                        {resourceData.mediumData.length > 0 && <MediumSelect items={resourceData.mediumData} handleItemSelect={onMediumSelect} />}
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col className="d-flex justify-content-center">
                        <Button type="submit">Search</Button>
                    </Col>
                </Row>
            </div>
        </Form>
    )
}

export default AdvancedFilter;