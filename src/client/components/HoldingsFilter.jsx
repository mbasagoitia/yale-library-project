import { useState, useEffect } from "react";
import { Container, Row, Col, Form, FormControl, Button, InputGroup } from "react-bootstrap";
import { BiFilter } from 'react-icons/bi';

import MediumSelect from "./call-number-selects/MediumSelect";
import SpeciesSelect from "./call-number-selects/SpeciesSelect";
import PublisherSelect from "./call-number-selects/PublisherSelect";
import Searchbar from "./Searchbar";
import fetchResourceData from "../helpers/fetchResourceData";
import { organizeMediumData, organizePublisherData, organizeSpeciesData } from "../helpers/organizeData";

const HoldingsFilter = () => {

    const [advancedFilter, setAdvancedFilter] = useState(false);

    const [resourceData, setResourceData] = useState({
        mediumData: [],
        speciesData: [],
        publisherData: [],
      });

    useEffect(() => {
        const fetchData = async () => {
          try {
            const resources = await fetchResourceData();
    
            const organizedMediumData = organizeMediumData(resources[0]);
            const organizedSpeciesData = organizeSpeciesData(resources[1]);
            const organizedPublisherData = organizePublisherData(resources[2]);
    
            setResourceData({ 
              mediumData: organizedMediumData,
              speciesData: organizedSpeciesData,
              publisherData: organizedPublisherData
             });
          } catch (error) {
            console.error("Error fetching resource data:", error);
          }
        }
        fetchData();
      }, [])

    return (
        <div className="holdings-filter">
        {advancedFilter ? (
            <div className="advanced-filter">
                <Row>
                    <Col className="d-flex justify-content-between">
                        <span>Filter By:</span>
                        <div className="open-basic-filter" onClick={() => setAdvancedFilter(false)}>
                            <BiFilter size={20} />
                            <span className="advanced-filter-text">Basic Filter</span>
                        </div>
                    </Col>
                </Row>
                    <div className="holdings-filter mt-4">
                        <Row className="mb-4">
                            <Col md={6}>
                                <Form.Label>Title</Form.Label>
                                <Searchbar placeholder={"Symphony no. 1"} />
                            </Col>
                            <Col md={6}>
                                <Form.Label>Composer</Form.Label>
                                <Searchbar placeholder={"Shostakovich"} />
                            </Col>
                            <Col md={6}>
                            <div className="mb-4 mt-4 mt-md-0">
                                <Form.Label>Publisher</Form.Label>
                                {resourceData.publisherData.length > 0 &&<PublisherSelect items={resourceData.publisherData} />}
                            </div>
                            </Col>
                            <Col md={6}>
                            <div>
                                <Form.Label>Genre</Form.Label>
                                {resourceData.speciesData.length > 0 &&<SpeciesSelect items={resourceData.speciesData} />}    
                            </div>
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col md={6}>
                                <Form.Label>Ensemble Type</Form.Label>
                                {resourceData.mediumData.length > 0 &&<MediumSelect items={resourceData.mediumData} />}
                            </Col>
                        </Row>
                    </div>
                </div>
        ) : (
            <Row className="mb-4">
                <Col xs={{ order: 2 }} sm={{ order: 1, span: 5 }}>
                    <Searchbar placeholder={"Title"} />
                </Col>
                <Col xs={{ order: 3 }} sm={{ order: 2, span: 5 }} className="mt-1 mt-sm-0">
                    <Searchbar placeholder={"Composer"} />
                </Col>
                <Col xs={{ order: 1 }} sm={{ order: 3, span: 2 }} className="d-flex flex-column justify-content-center mb-4 mb-sm-0">
                <div className="open-advanced-filter" onClick={() => setAdvancedFilter(true)}>
                    <BiFilter size={20} />
                    <span className="advanced-filter-text">Advanced Filter</span>
                </div>
                </Col>
            </Row>
        )}
        </div>
    )
}

export default HoldingsFilter;