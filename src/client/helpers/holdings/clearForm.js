const clearForm = (setShowCall, setMainInfo, setAdditionalInfo, setFormErrors) => {
  setShowCall(false);
  // Reset Main Info
  setMainInfo({
    title: "",
    identifierLabel: "Op.",
    identifierValue: "",
    number: "",
    medium: {},
    composer: {},
    genre: {},
    publisher: {},
    callNumber: [],
  });

  // Reset Additional Info
  setAdditionalInfo({
    ownPhysical: true,
    ownDigital: false,
    scansUrl: "",
    publicDomain: true,
    condition: 1,
    missingParts: false,
    lastPerformed: null,
    notes: "",
  });

  // Reset Form Errors
  setFormErrors({});
};

export default clearForm;
