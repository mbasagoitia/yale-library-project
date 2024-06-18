import { useState, useEffect } from "react";
import ComposerFilter from "../ComposerFilter";

const ComposerSelect = ({ mainInfo, setMainInfo }) => {

    const [composerList, setComposerList] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/composer-data", {
            credentials: "include"
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response error");
            }
            return res.json();
        })
        .then((data) => {
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
        <ComposerFilter items={composerList} onItemClick={onItemClick} />
        </>
    )
}

export default ComposerSelect;