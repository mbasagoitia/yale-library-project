import SearchFilter from "../../search-filters/SearchFilter";

const PublisherSelect = ({ items, selectedItem, onItemClick }) => {

    return (
        <>
        {/* initial value should be passed in from search state */}
        <SearchFilter placeholder={"Publisher"} initialValue={""} items={items} onItemClick={onItemClick} selectedItem={selectedItem} />
        </>
    )
}

export default PublisherSelect;