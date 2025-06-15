import SearchFilter from "../../search-filters/SearchFilter";

const SpeciesSelect = ({ items, mainInfo, onItemClick }) => {
    // The dropdown list will be a searchable filter
    return (
        <>
        <SearchFilter initialValue={mainInfo?.genre?.id ? mainInfo.genre.label : ""} items={items} onItemClick={onItemClick} />
        </>
    )
}

export default SpeciesSelect;
