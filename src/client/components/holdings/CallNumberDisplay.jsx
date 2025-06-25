const CallNumberDisplay = ({ callNumber }) => (
    <div className="alert alert-success d-flex flex-column align-items-center my-4" role="alert">
      <h4>Call Number:</h4>
      <div>
        {callNumber.map((line, index) => (
          <div className="callNumLine" key={index}>{line}</div>
        ))}
      </div>
    </div>
  );

export default CallNumberDisplay;