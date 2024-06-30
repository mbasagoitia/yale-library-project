import SearchFilter from "../SearchFilter";

const PublisherSelect = ({ items, mainInfo, setMainInfo }) => {
    const onItemClick = (item) => {
        setMainInfo({ ...mainInfo, publisher: item });
    }

    return (
        <>
        <SearchFilter initialValue={mainInfo.publisher.id ? mainInfo.publisher.label : ""} items={items} onItemClick={onItemClick} />
        </>
    )
}

export default PublisherSelect;