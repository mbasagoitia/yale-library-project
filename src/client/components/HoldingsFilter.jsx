import { useState } from "react";
import BasicFilter from "./BasicFilter";
import AdvancedFilter from "./AdvancedFilter";

const HoldingsFilter = () => {

    const [advancedFilter, setAdvancedFilter] = useState(false);

    return (
        <div className="holdings-filter">
        {advancedFilter ? (
            <AdvancedFilter setAdvancedFilter={setAdvancedFilter} />
        ) : (
            <BasicFilter setAdvancedFilter={setAdvancedFilter} />
        )}
        </div>
    )
}

export default HoldingsFilter;