import { useState, useEffect } from "react";
import MediumSelect from './call-number-selects/MediumSelect';
import ComposerSelect from "./call-number-selects/ComposerSelect";
import SpeciesSelect from "./call-number-selects/SpeciesSelect";
import PublisherSelect from "./call-number-selects/PublisherSelect";
import medium from "../classifications/medium";


const CallNumber = () => {
    const [submitted, setSubmitted] = useState(false);
    const [callNumber, setCallNumber] = useState("");
    // Remember to add checks to make sure each required item has been selected
    const [mediumType, setMediumType] = useState("");
    const [cutterNumber, setCutterNumber] = useState("");
    const [species, setSpecies] = useState("");
    const [publisher, setPublisher] = useState("");

    useEffect(() => {
        // Reset nested dropdowns whenever the first level menu changes
      }, [medium]);

    const handleSubmit = () => {
        // Send information to database and catalogue new piece. This will involve generating an accession number behind the scenes.

        // Display the call number so that the librarian can label and catalogue the new piece
        let call = `${mediumType}  ${cutterNumber} ${species} ${publisher}`;
        setCallNumber(call);
        setSubmitted(true);
    }

    return (
        <div className="callNumber">
            <h2>Catalogue Information</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="titleInput">Enter Title</label>
                <input type="text" id="titleInput"></input>
                <h3>Select Medium</h3>
                <MediumSelect items={medium} setMediumType={setMediumType} />
                <h3>Select Composer</h3>
                <ComposerSelect setCutterNumber={setCutterNumber} />
                <h3>Select Genre</h3>
                <SpeciesSelect setSpecies={setSpecies} />
                <h3>Select Publisher</h3>
                <PublisherSelect setPublisher={setPublisher} />
                <button>Submit</button>
            </form>
            <div className={`${submitted ? "d-block" : "d-none"}`}>
                <h1>{`Call Number: ${callNumber}`}</h1>
            </div>
        </div>
    )
}

export default CallNumber;