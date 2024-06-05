import { useState, useEffect } from "react";
import species from "../../classifications/species";
import SearchFilter from "../SearchFilter";

const SpeciesSelect = ({ setSpecies }) => {
    const [speciesTitle, setSpeciesTitle] = useState("");
    const [opusNumber, setOpusNumber] = useState("");
    const [number, setNumber] = useState("");

    useEffect(() => {
        let updatedTitle = speciesTitle;
        if (opusNumber) {
            updatedTitle += ` Op. ${opusNumber}`;
        }
        if (number) {
            updatedTitle += ` No. ${number}`;
        }
        setSpecies(updatedTitle);
    }, [speciesTitle, opusNumber, number, setSpecies]);

    const onItemClick = (item) => {
        setSpeciesTitle(item.name);
    };

    return (
        <>
            <SearchFilter items={species} onItemClick={onItemClick} />
            <input
                type="number"
                value={opusNumber}
                onChange={(e) => setOpusNumber(e.target.value)}
                placeholder="Opus Number"
            />
            <input
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Number"
            />
        </>
    );
};

export default SpeciesSelect;
