import { useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import BasicFilter from "./BasicFilter";
import AdvancedFilter from "./AdvancedFilter";
import filterSearch from "../../helpers/search/filterSearch";
import { basicSearch, advancedSearch } from "../../../redux/searchSlice";

const HoldingsFilter = ({ setShowResults, setFilteredItems }) => {

    const [advancedFilter, setAdvancedFilter] = useState(false);

    const search = useSelector((state) => state.search);

    const [searchCriteria, setSearchCriteria] = useState(() => ({
        title: search.filters?.title || '',
        composer: search.filters?.composer || '',
        publisher: search.filters?.publisher || '',
        genre: search.filters?.genre || '',
        medium: search.filters?.medium || '',
      }));

    const holdings = useSelector((state) => state.library.holdings);

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(searchCriteria);
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
        const filtered = filterSearch(searchCriteria, holdings);
        setFilteredItems(filtered);
        setShowResults(true);
    }

    return (
        // How does this affect the styling?
        <div className="holdings-filter">
            <Form onSubmit={handleSubmit}>
            {advancedFilter ? (
                <AdvancedFilter setAdvancedFilter={setAdvancedFilter} searchCriteria={searchCriteria} setSearchCriteria={setSearchCriteria} />
            ) : (
                <BasicFilter setAdvancedFilter={setAdvancedFilter} searchCriteria={searchCriteria} setSearchCriteria={setSearchCriteria} />
            )}
            <Button type="submit">Search</Button>
            </Form>
        </div>
        
    )
}

export default HoldingsFilter;