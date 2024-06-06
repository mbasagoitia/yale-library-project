import species from "../../classifications/species";
import SearchFilter from "../SearchFilter";

const SpeciesSelect = ({ setSpecies }) => {
    // Set cutter number when the user selects the composer
    const onItemClick = (item) => {
        console.log(item);
        setSpecies(item.abbr);
    }
    // The dropdown list will be a searchable filter
    return (
        <>
        <SearchFilter items={species} onItemClick={onItemClick} />
        </>
    )
}

export default SpeciesSelect;
