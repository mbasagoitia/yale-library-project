import { useState } from "react";
import BasicFilter from "./BasicFilter";
import AdvancedFilter from "./AdvancedFilter";

const HoldingsFilter = ({ holdingsData, setFilteredItems }) => {

    // You will pass holdingsData and searchCriteria into the function that changes the filter
    // And update the items to display with setFilteredItems

    const [advancedFilter, setAdvancedFilter] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState({
        title: "",
        composer: "",
        medium: {},
        genre: {},
        publisher: {}
    });

    return (
        <div className="holdings-filter">
        {advancedFilter ? (
            <AdvancedFilter setAdvancedFilter={setAdvancedFilter} searchCriteria={searchCriteria} setSearchCriteria={setSearchCriteria} />
        ) : (
            <BasicFilter setAdvancedFilter={setAdvancedFilter} searchCriteria={searchCriteria} setSearchCriteria={setSearchCriteria} />
        )}
        </div>
    )
}

export default HoldingsFilter;