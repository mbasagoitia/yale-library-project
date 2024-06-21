import SearchFilter from "../SearchFilter";

const PublisherSelect = ({ items, mainInfo, setMainInfo }) => {
    const onItemClick = (item) => {
        setMainInfo({ ...mainInfo, publisher: item });
    }

    return (
        <>
        <SearchFilter items={items} onItemClick={onItemClick} />
        </>
    )
}

export default PublisherSelect;