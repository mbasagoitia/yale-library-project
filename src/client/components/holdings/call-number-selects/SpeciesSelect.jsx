import SearchFilter from "../../search-filters/SearchFilter";

const SpeciesSelect = ({ items, onItemClick, mainInfo }) => {
    return (
        <>
        <SearchFilter placeholder={"Genre"} initialValue={mainInfo?.genre?.label || ''} items={items} onItemClick={onItemClick} />
        </>
    )
}

export default SpeciesSelect;
