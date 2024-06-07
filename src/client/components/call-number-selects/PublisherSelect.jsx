import publishers from "../../classifications/publishers";
import SearchFilter from "../SearchFilter";

const PublisherSelect = ({ setPublisher }) => {
    // Set cutter number when the user selects the composer
    const onItemClick = (item) => {
        setPublisher(item.abbr);
    }
    // The dropdown list will be a searchable filter
    return (
        <>
        <SearchFilter items={publishers} onItemClick={onItemClick} />
        </>
    )
}

export default PublisherSelect;