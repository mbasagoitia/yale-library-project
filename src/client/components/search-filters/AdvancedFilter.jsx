import { useState, useEffect } from "react";
import { Row, Col, Form, Button, Dropdown } from "react-bootstrap";
import MediumSelect from "../holdings/call-number-selects/MediumSelect";
import SpeciesSelect from "../holdings/call-number-selects/SpeciesSelect";
import PublisherSelect from "../holdings/call-number-selects/PublisherSelect";
import fetchResourceData from "../../helpers/holdings/fetchResourceData";
import { BiFilter } from 'react-icons/bi';
import FilterInput from "./FilterInput";

const AdvancedFilter = ({ setAdvancedFilter, searchCriteria, setSearchCriteria, onSubmit }) => {

    const [mediumSelectShown, setMediumSelectShown] = useState(false);

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

    const handleToggleMediumSelect = () => {
        setMediumSelectShown(prevMediumSelectShown => !prevMediumSelectShown);
    };

    useEffect(() => {
        setSearchCriteria(prevSearchCriteria => ({
            ...prevSearchCriteria,
            medium: mediumSelectShown ? resourceData.mediumData[0].options[0] : {}
        }));
    }, [mediumSelectShown, resourceData.mediumData, setSearchCriteria]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    }
    
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
                        <Form.Label>
                            <Dropdown.Toggle id="dropdown-basic" className="p-0 ensemble-toggle-btn" onClick={handleToggleMediumSelect}>Ensemble Type</Dropdown.Toggle>
                        </Form.Label>
                        {mediumSelectShown && (
                            resourceData.mediumData.length > 0 && <MediumSelect items={resourceData.mediumData} handleItemSelect={onMediumSelect} />
                        )}
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