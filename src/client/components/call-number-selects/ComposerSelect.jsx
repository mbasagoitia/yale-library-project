import { useState, useEffect } from "react";
import SearchFilter from "../SearchFilter";

const ComposerSelect = ({ mainInfo, setMainInfo }) => {

    const [composerList, setComposerList] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/composer-data", {
            credentials: "include"
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
            setComposerList(data);
        })
        .catch((error) => {
            console.error("Fetch error:", error);
        });
    }, []);
    
    
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