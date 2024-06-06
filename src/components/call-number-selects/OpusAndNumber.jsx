import React, { useState } from "react";

const OpusAndNumber = ({ setOpus, setNumber }) => {
  const [opusValue, setOpusValue] = useState("");
  const [numberValue, setNumberValue] = useState("");

  const handleOpusChange = (e) => {
    setOpusValue(e.target.value);
    setOpus(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNumberValue(e.target.value);
    setNumber(e.target.value);
  };

  return (
    <div className="opusAndNumber">
      <label htmlFor="opusInput">Opus:</label>
      <input
        type="number"
        id="opusInput"
        value={opusValue}
        onChange={handleOpusChange}
      />
      <label htmlFor="numberInput">Number:</label>
      <input
        type="number"
        id="numberInput"
        value={numberValue}
        onChange={handleNumberChange}
      />
    </div>
  );
};

export default OpusAndNumber;
