import SearchFilter from "../SearchFilter";

const SpeciesSelect = ({ items, mainInfo, setMainInfo }) => {
    const onItemClick = (item) => {
        setMainInfo({ ...mainInfo, genre: item });
    }
    // The dropdown list will be a searchable filter
    return (
        <>
        <SearchFilter items={items} onItemClick={onItemClick} />
        </>
    )
}

export default SpeciesSelect;
