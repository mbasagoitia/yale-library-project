import React, { useState, useEffect } from "react";
import MediumSelect from './call-number-selects/MediumSelect';
import ComposerSelect from "./call-number-selects/ComposerSelect";
import SpeciesSelect from "./call-number-selects/SpeciesSelect";
import PublisherSelect from "./call-number-selects/PublisherSelect";
import OpusAndNumber from "./call-number-selects/OpusAndNumber";
import medium from "../classifications/medium";

const CallNumber = () => {
  const [submitted, setSubmitted] = useState(false);
  const [callNumber, setCallNumber] = useState("");
  // this needs to account for when nothing is changed
  const [mediumType, setMediumType] = useState(0x0);
  const [cutterNumber, setCutterNumber] = useState("");
  const [species, setSpecies] = useState("");
  const [publisher, setPublisher] = useState("");
  const [opus, setOpus] = useState("");
  const [number, setNumber] = useState("");

  useEffect(() => {
    // Reset nested dropdowns whenever the first level menu changes
  }, [medium]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send information to database and catalogue new piece. This will involve generating an accession number behind the scenes.

    // Append Opus and Number to the species title
    let speciesTitle = species;
    if (opus && number) {
        speciesTitle += ` ${opus}/${number}`;
    } else if (opus) {
        speciesTitle += ` Op.${opus}`;
    } else if (number) {
        speciesTitle += ` no.${number}`;
    }

    // Display the call number so that the librarian can label and catalogue the new piece
    let call = `${mediumType} ${cutterNumber} ${speciesTitle} ${publisher}`;
    setCallNumber(call);
    console.log(mediumType, cutterNumber, speciesTitle, publisher);
    setSubmitted(true);
};


  return (
    <div className="callNumber">
      <h2>Catalogue Information</h2>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="titleInput">Enter Title</label>
        <input type="text" id="titleInput"></input>
        <OpusAndNumber setOpus={setOpus} setNumber={setNumber} />
        <h3>Select Medium</h3>
        <MediumSelect items={medium} setMediumType={setMediumType} />
        <h3>Select Composer</h3>
        <ComposerSelect setCutterNumber={setCutterNumber} />
        <h3>Select Genre</h3>
        <SpeciesSelect setSpecies={setSpecies} />
        <h3>Select Publisher</h3>
        <PublisherSelect setPublisher={setPublisher} />
        <button>Generate Call Number</button>
      </form>
      <div className={`${submitted ? "d-block" : "d-none"}`}>
        <h1>{`Call Number: ${callNumber}`}</h1>
      </div>
    </div>
  );
};

export default CallNumber;
