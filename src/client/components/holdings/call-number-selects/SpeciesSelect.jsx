import SearchFilter from "../../search-filters/SearchFilter";

const SpeciesSelect = ({ items, selectedItem, onItemClick }) => {
    return (
        <>
        <SearchFilter placeholder={"Genre"} initialValue={""} selectedItem={selectedItem} items={items} onItemClick={onItemClick} />
        </>
    )
}

export default SpeciesSelect;
