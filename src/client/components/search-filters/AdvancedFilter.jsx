import { useState, useEffect } from "react";
import { Row, Col, Form, Dropdown } from "react-bootstrap";
import MediumSelect from "../holdings/call-number-selects/MediumSelect";
import SpeciesSelect from "../holdings/call-number-selects/SpeciesSelect";
import PublisherSelect from "../holdings/call-number-selects/PublisherSelect";
import useFetchResourceData from "../../hooks/useFetchResourceData";
import FilterInput from "./FilterInput";
import { useDispatch } from "react-redux";
import { clearSearch } from "../../../redux/searchSlice";

const AdvancedFilter = ({ searchCriteria, setSearchCriteria, resetHoldings }) => {
  const [mediumSelectShown, setMediumSelectShown] = useState(false);
  const [genreKey, setGenreKey] = useState(1);
  const [publisherKey, setPublisherKey] = useState(1);

  const resourceData = useFetchResourceData();
  const dispatch = useDispatch();

  useEffect(() => {
    if (mediumSelectShown && resourceData.mediumData.length > 0) {
      setSearchCriteria((prev) => {
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
      setSearchCriteria((prev) => ({
        ...prev,
        medium: null,
      }));
    }
  }, [mediumSelectShown, resourceData.mediumData, setSearchCriteria]);

  const onTitleChange = (e) =>
    setSearchCriteria({
      ...searchCriteria,
      title: e.target.value,
    });

  const onComposerChange = (e) =>
    setSearchCriteria({
      ...searchCriteria,
      composer: e.target.value,
    });

  const onMediumSelect = (item) =>
    setSearchCriteria({
      ...searchCriteria,
      medium: item,
    });

  const onGenreSelect = (item) =>
    setSearchCriteria({
      ...searchCriteria,
      genre: item,
    });

  const onPublisherSelect = (item) =>
    setSearchCriteria({
      ...searchCriteria,
      publisher: item,
    });

  const handleToggleMediumSelect = () =>
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

  const clearSearchCriteria = () => {
    dispatch(clearSearch());
    resetHoldings();
    setMediumSelectShown(false);
    setGenreKey((k) => k + 1);
    setPublisherKey((k) => k + 1);
    setSearchCriteria({
      composer: "",
      title: "",
      medium: "",
      publisher: "",
      genre: "",
    });
  };

  return (
    <div className="advanced-filter">
      <div className="mt-2">
        <div className="reset-text mb-2" onClick={clearSearchCriteria}>
          Reset
        </div>

        <Row className="mb-0 mb-md-4">
          <Col md={6} className="my-2 my-md-0">
            <FilterInput
              placeholder="Title"
              value={searchCriteria.title || ""}
              onChange={onTitleChange}
            />
          </Col>
          <Col md={6} className="my-2 my-md-0">
            <FilterInput
              placeholder="Composer"
              value={searchCriteria.composer || ""}
              onChange={onComposerChange}
            />
          </Col>
        </Row>

        <Row>
          <Col md={6} className="my-2 my-md-0">
            {resourceData.publisherData.length > 0 ? (
              <PublisherSelect
                key={publisherKey}
                items={resourceData.publisherData}
                selectedItem={searchCriteria?.publisher}
                onItemClick={onPublisherSelect}
              />
            ) : (
              <div className="skeleton skeleton-select">Loading publishers…</div>
            )}
          </Col>

          <Col md={6} className="my-2 my-md-0">
            {resourceData.speciesData.length > 0 ? (
              <SpeciesSelect
                key={genreKey}
                items={resourceData.speciesData}
                selectedItem={searchCriteria?.genre}
                onItemClick={onGenreSelect}
              />
            ) : (
              <div className="skeleton skeleton-select">Loading genres…</div>
            )}
          </Col>
        </Row>

        <Row className="my-0 my-md-3 advanced-filter-row">
          <Col className="my-2 my-md-0 medium-select-col">
            <Form.Label>
              <Dropdown.Toggle
                id="dropdown-basic"
                className="p-0 ensemble-toggle-btn"
                onClick={handleToggleMediumSelect}
              >
                Ensemble Type
              </Dropdown.Toggle>
            </Form.Label>
            <div className="medium-select-container">
              {mediumSelectShown &&
                (resourceData.mediumData.length > 0 ? (
                  <MediumSelect
                    items={resourceData.mediumData}
                    handleItemSelect={onMediumSelect}
                  />
                ) : (
                  <div className="skeleton skeleton-list">Loading…</div>
                ))}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdvancedFilter;
