import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import BasicFilter from "./BasicFilter";
import AdvancedFilter from "./AdvancedFilter";
import { BiFilter } from 'react-icons/bi';
import { basicSearch, advancedSearch } from "../../../redux/searchSlice";
import { clearSearch } from "../../../redux/searchSlice";
import "../../../assets/styles/components/HoldingsFilter.css";

const HoldingsFilter = ({ setShowResults }) => {

    const [advancedFilter, setAdvancedFilter] = useState(false);

    const search = useSelector((state) => state.search);

    const [searchCriteria, setSearchCriteria] = useState({
        title: '',
        composer: '',
        publisher: '',
        genre: '',
        medium: '',
      });
      
      useEffect(() => {
        setSearchCriteria({
          title: search.filters?.title || '',
          composer: search.filters?.composer || '',
          publisher: search.filters?.publisher || '',
          genre: search.filters?.genre || '',
          medium: search.filters?.medium || '',
        });
      }, [search.filters]);

      const dispatch = useDispatch();

    const resetHoldings = () => {
        dispatch(clearSearch());
        setShowResults(false);
    }

    const clearAdvancedSearch = () => {
        setSearchCriteria((prev) => ({
            ...prev,
            medium: null,
            publisher: null,
            genre: null
        }))
    }

    const handleFilterSwitch = () => {
        if (advancedFilter) {
            clearAdvancedSearch();
        }
        setAdvancedFilter(!advancedFilter);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!advancedFilter) {
          dispatch(basicSearch({ composer: searchCriteria.composer, title: searchCriteria.title }));
        } else {
          dispatch(advancedSearch({
            composer: searchCriteria.composer,
            title: searchCriteria.title,
            genre: searchCriteria.genre,
            medium: searchCriteria.medium,
            publisher: searchCriteria.publisher
          }));
        }
        setShowResults(true);
      };

    return (
        <div className="holdings-filter">
            <Form onSubmit={handleSubmit}>
                <div className="open-basic-filter d-flex mb-1" onClick={handleFilterSwitch}>
                    <BiFilter size={20} />
                    <span className="filter-text ms-1">{`${advancedFilter ? "Basic" : "Advanced"} Filter`}</span>
                </div>
            {advancedFilter ? (
                <AdvancedFilter searchCriteria={searchCriteria} setSearchCriteria={setSearchCriteria} resetHoldings={resetHoldings} />
            ) : (
                <BasicFilter searchCriteria={searchCriteria} setSearchCriteria={setSearchCriteria} />
            )}
                <Button type="submit">Search</Button>
            </Form>
        </div>
        
    )
}

export default HoldingsFilter;