import { Col } from "react-bootstrap";

const OpusAndNumber = ({ mainInfo, setMainInfo }) => {

  const handleOpusChange = (e) => {
    setMainInfo({ ...mainInfo, opus: e.target.value });
  };

  const handleNumberChange = (e) => {
    setMainInfo({ ...mainInfo, number: e.target.value });
  };

  return (
    <>
        <Col md={2} className="my-2 my-md-0">
          <label htmlFor="opusInput" className="form-label">Opus:</label>
          <input
            type="number"
            className="form-control"
            id="opusInput"
            value={mainInfo.opus}
            onChange={handleOpusChange}
          />
        </Col>
        <Col md={2}>
          <label htmlFor="numberInput" className="form-label">Number:</label>
          <input
            type="number"
            className="form-control"
            id="numberInput"
            value={mainInfo.number}
            onChange={handleNumberChange}
          />
        </Col>
    </>
  );
};

export default OpusAndNumber;
