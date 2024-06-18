import { useState, useEffect } from "react";
import SearchFilter from "../SearchFilter";

const ComposerSelect = ({ mainInfo, setMainInfo }) => {
    // Initialize composer list data
    const [composerList, setComposerList] = useState([]);

    // useEffect(() => {
    //     fetch("http://localhost:5000/api/composerList", {
    //         credentials: "include"
    //     })
    //     .then((res) => res.json())
    //     // Data should come as an array of objects containing the composer name, unique ID, and cutter number
    //     .then((data) => setComposerList(data));
    // }, [])
    
    // Set cutter number when the user selects the composer
    const onItemClick = (item) => {
        setMainInfo({ ...mainInfo, composer: item });
    }

    return (
        <>
        <SearchFilter items={composerList} onItemClick={onItemClick} />
        </>
    )
}

export default ComposerSelect;