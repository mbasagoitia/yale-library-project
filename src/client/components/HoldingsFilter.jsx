import { useState, useEffect } from "react";
import { Container, Row, Col, Form, FormControl, Button } from "react-bootstrap";
import { BiFilter } from 'react-icons/bi';

import MediumSelect from "./call-number-selects/MediumSelect";
import SpeciesSelect from "./call-number-selects/SpeciesSelect";
import PublisherSelect from "./call-number-selects/PublisherSelect";
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
        <>
        {advancedFilter ? (
            <div className="advanced-filter">
                    <p>Filter By:</p>
                    <div className="holdings-filter">
                        <Row className="mb-4">
                            <Col>
                                <p>Title</p>
                                <Form className="mb-4">
                                    <div className="search-wrapper">
                                        <FormControl type="text" placeholder="Symphony no. 1" className="mr-sm-2 rounded-pill" />
                                        <Button type="submit" variant="rounded-pill search-button">
                                            <i className="fa fa-search"></i>
                                        </Button>
                                    </div>
                                </Form>
                                <p>Composer</p>
                                <Form>
                                    <div className="search-wrapper">
                                        <FormControl type="text" placeholder="Shostakovich" className="mr-sm-2 rounded-pill" />
                                        <Button type="submit" variant="rounded-pill search-button">
                                            <i className="fa fa-search"></i>
                                        </Button>
                                    </div>
                                </Form>
                            </Col>
                            <Col>
                            <div className="mb-4">
                                <p>Publisher</p>
                                {resourceData.publisherData.length > 0 &&<PublisherSelect items={resourceData.publisherData} />}
                            </div>
                            <div>
                                <p>Genre</p>
                                {resourceData.speciesData.length > 0 &&<SpeciesSelect items={resourceData.speciesData} />}    
                            </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p>Ensemble Type</p>
                                {resourceData.mediumData.length > 0 &&<MediumSelect items={resourceData.mediumData} />}
                            </Col>
                        </Row>
                    </div>
                </div>
        ) : (
            <Row className="mb-4">
                <Col sm={5}>
                    <Form className="mb-4 d-inline">
                        <div className="search-wrapper">
                            <FormControl type="text" placeholder="Title" className="mr-sm-2 rounded-pill" />
                            <Button type="submit" variant="rounded-pill search-button">
                                <i className="fa fa-search"></i>
                            </Button>
                        </div>
                    </Form>
                </Col>
                <Col sm={5}>
                    <Form className="mb-4 d-inline">
                        <div className="search-wrapper">
                            <FormControl type="text" placeholder="Composer" className="mr-sm-2 rounded-pill" />
                            <Button type="submit" variant="rounded-pill search-button">
                                <i className="fa fa-search"></i>
                            </Button>
                        </div>
                    </Form>
                </Col>
                <Col sm={2} className="d-flex flex-column justify-content-center">
                <div className="open-advanced-filter" onClick={() => setAdvancedFilter(true)}>
                    <BiFilter size={20} />
                    <span className="advanced-filter-text">Advanced Filter</span>
                </div>
                </Col>
            </Row>
        )}
        </>
    )
}

export default HoldingsFilter;