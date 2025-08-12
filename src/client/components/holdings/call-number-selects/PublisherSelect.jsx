import SearchFilter from "../../search-filters/SearchFilter";

const PublisherSelect = ({ items, onItemClick, mainInfo }) => {

    return (
        <>
        <SearchFilter id="publisher-select" placeholder="Publisher" initialValue={mainInfo?.publisher?.label || ''} items={items} onItemClick={onItemClick} />
        </>
    )
}

export default PublisherSelect;