import { useState } from "react";
import BasicFilter from "./BasicFilter";
import AdvancedFilter from "./AdvancedFilter";
import filterSearch from "../../helpers/holdings/filterSearch";

const HoldingsFilter = ({ holdingsData, setFilteredItems, setShowResults }) => {

    const [advancedFilter, setAdvancedFilter] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState({
        title: "",
        composer: "",
        medium: {},
        genre: {},
        publisher: {}
    });

    const onSubmit = (holdingsData, searchCriteria) => {
        const filtered = filterSearch(holdingsData, searchCriteria);
        setFilteredItems(filtered);
        setShowResults(true);
    }

    return (
        <div className="holdings-filter">
        {advancedFilter ? (
            <AdvancedFilter setAdvancedFilter={setAdvancedFilter} searchCriteria={searchCriteria} setSearchCriteria={setSearchCriteria} onSubmit={() => onSubmit(holdingsData, searchCriteria)} />
        ) : (
            <BasicFilter setAdvancedFilter={setAdvancedFilter} searchCriteria={searchCriteria} setSearchCriteria={setSearchCriteria} onSubmit={() => onSubmit(holdingsData, searchCriteria)} />
        )}
        </div>
    )
}

export default HoldingsFilter;