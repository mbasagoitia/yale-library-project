import SearchFilter from "../../search-filters/SearchFilter";

const PublisherSelect = ({ items, onItemClick, mainInfo }) => {

    return (
        <>
        {/* initial value should be passed in from search state */}
        <SearchFilter placeholder={"Publisher"} initialValue={mainInfo?.publisher?.label || ''} items={items} onItemClick={onItemClick} />
        </>
    )
}

export default PublisherSelect;