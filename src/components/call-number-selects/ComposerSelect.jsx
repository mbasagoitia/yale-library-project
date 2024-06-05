import { useState, useEffect } from "react";
import SearchFilter from "../SearchFilter";

const ComposerSelect = ({ setCutterNumber }) => {
    // Initialize composer list data
    const [composerList, setComposerList] = useState([]);
    // Set cutter number when the user selects the composer
    const onItemClick = (item) => {
        setCutterNumber(item);
    }
    // Make call to database to fetch a list of composers and populate the dropdown menu
    // useEffect(() => {
    //     fetch("http://localhost:5000/api/composerList", {
    //         credentials: "include"
    //     })
    //     .then((res) => res.json())
    //     // Data should come as an array of objects containing the composer name, unique ID, and cutter number
    //     .then((data) => setComposerList(data));
    // }, [])
    // The dropdown list will be a searchable filter
    return (
        <>
        <SearchFilter items={composerList} onItemClick={onItemClick} />
        </>
    )
}

export default ComposerSelect;