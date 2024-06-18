import publishers from "../../classifications/publishers";
import SearchFilter from "../SearchFilter";

const PublisherSelect = ({ mainInfo, setMainInfo }) => {
    const onItemClick = (item) => {
        setMainInfo({ ...mainInfo, publisher: item });
    }

    return (
        <>
        <SearchFilter items={publishers} onItemClick={onItemClick} />
        </>
    )
}

export default PublisherSelect;