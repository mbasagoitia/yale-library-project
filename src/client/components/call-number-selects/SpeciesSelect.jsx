import species from "../../classifications/species";
import SearchFilter from "../SearchFilter";

const SpeciesSelect = ({ mainInfo, setMainInfo }) => {
    // Set cutter number when the user selects the composer
    const onItemClick = (item) => {
        setMainInfo({ ...mainInfo, genre: item });
    }
    // The dropdown list will be a searchable filter
    return (
        <>
        <SearchFilter items={species} onItemClick={onItemClick} />
        </>
    )
}

export default SpeciesSelect;
