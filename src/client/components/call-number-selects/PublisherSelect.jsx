import SearchFilter from "../SearchFilter";

const PublisherSelect = ({ items, mainInfo, onItemClick }) => {

    return (
        <>
        <SearchFilter initialValue={mainInfo?.publisher?.id ? mainInfo.publisher.label : ""} items={items} onItemClick={onItemClick} />
        </>
    )
}

export default PublisherSelect;