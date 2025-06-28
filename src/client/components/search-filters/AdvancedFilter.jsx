import { useState, useEffect } from "react";
import { Row, Col, Form, Dropdown } from "react-bootstrap";
import MediumSelect from "../holdings/call-number-selects/MediumSelect";
import SpeciesSelect from "../holdings/call-number-selects/SpeciesSelect";
import PublisherSelect from "../holdings/call-number-selects/PublisherSelect";
import useFetchResourceData from "../../hooks/useFetchResourceData";
import { BiFilter } from 'react-icons/bi';
import FilterInput from "./FilterInput";
import { useDispatch } from "react-redux";
import { clearSearch } from "../../../redux/searchSlice";

const AdvancedFilter = ({ setAdvancedFilter, searchCriteria, setSearchCriteria }) => {

    const [mediumSelectShown, setMediumSelectShown] = useState(false);

    const resourceData = useFetchResourceData();

    const dispatch = useDispatch();

    useEffect(() => {
        if (mediumSelectShown && resourceData.mediumData.length > 0) {
          setSearchCriteria(prev => {
            if (!prev.medium) {
              return {
                ...prev,
                medium: resourceData.mediumData[0]?.options?.[0] || null,
              };
            }
            return prev;
          });
        }
      
        if (!mediumSelectShown) {
          setSearchCriteria(prev => ({
            ...prev,
            medium: null
          }));
        }
      }, [mediumSelectShown, resourceData.mediumData]);

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
      };

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
        setMediumSelectShown((prev) => {
          const newShown = !prev;
      
          if (!newShown) {
            setSearchCriteria((prevCriteria) => ({
              ...prevCriteria,
              medium: null,
            }));
          }
      
          return newShown;
        });
    };

    const clearSearchCriteria = () => {
        dispatch(clearSearch());

        setSearchCriteria({
            composer: null,
            title: null,
            medium: null,
            publisher: null,
            genre: null
        })
    }

    const clearAdvancedSearch = () => {
        setSearchCriteria((prev) => ({
            ...prev,
            medium: null,
            publisher: null,
            genre: null
        }))
    }
    
    return (
        <div className="advanced-filter">
        <Row>
            <Col className="d-flex justify-content-between">
                <p className="filter-by-text">Filter By:</p>
                <div className="open-basic-filter" onClick={() => setAdvancedFilter(false)}>
                    <BiFilter size={20} />
                    <span className="filter-text ms-2" onClick={clearAdvancedSearch}>Basic Filter</span>
                </div>
            </Col>
            <span className="reset-text mt-2" onClick={clearSearchCriteria}>Reset</span>
        </Row>
            <div className="holdings-filter mt-4">
                <Row className="mb-0 mb-md-4">
                    <Col md={6} className="my-2 my-md-0">
                        <Form.Label>Title</Form.Label>
                        <FilterInput placeholder={"Symphony no. 1"} value={searchCriteria.title || ''} onChange={onTitleChange} />
                    </Col>
                    <Col md={6} className="my-2 my-md-0">
                        <Form.Label>Composer</Form.Label>
                        <FilterInput placeholder={"Shostakovich"} value={searchCriteria.composer || ''} onChange={onComposerChange} />
                    </Col>
                </Row>
                <Row>
                    <Col md={6} className="my-2 my-md-0">
                        <Form.Label>Publisher</Form.Label>
                        {resourceData.publisherData.length > 0 && <PublisherSelect
                                                                    items={resourceData.publisherData}
                                                                    selectedItem={searchCriteria.publisher}
                                                                    onItemClick={onPublisherSelect}
                                                                    />}
                    </Col>
                    <Col md={6} className="my-2 my-md-0">
                        <Form.Label>Genre</Form.Label>
                        {resourceData.speciesData.length > 0 && <SpeciesSelect items={resourceData.speciesData}
                                                                    selectedItem={searchCriteria.genre}
                                                                    onItemClick={onGenreSelect} 
                                                                    />}    
                    </Col>
                </Row>
                <Row className="my-0 my-md-3">
                    <Col xs={12} className="my-2 my-md-0">
                        <Form.Label>
                            <Dropdown.Toggle id="dropdown-basic" className="p-0 ensemble-toggle-btn" onClick={handleToggleMediumSelect}>Ensemble Type</Dropdown.Toggle>
                        </Form.Label>
                        {mediumSelectShown && (
                            resourceData.mediumData.length > 0 && <MediumSelect items={resourceData.mediumData}
                                                                    selectedItem={searchCriteria.medium}
                                                                    handleItemSelect={onMediumSelect} 
                                                                    />)}
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default AdvancedFilter;