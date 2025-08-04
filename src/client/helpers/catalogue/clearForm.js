const clearForm = (setShowCall, setMainInfo, setAdditionalInfo, setMediumResetKey, setFormErrors) => {
    setShowCall(false)

          setMainInfo({
            title: "",
            identifierLabel: "Op.",
            identifierValue: "",
            number: "",
            medium: null,
            composer: null,
            genre: null,
            publisher: null,
            callNumber: []
          });

          setMediumResetKey(prev => prev + 1);

          setAdditionalInfo({
            ownPhysical: true,
            ownDigital: false,
            scansUrl: "",
            ownScore: true,
            publicDomain: true,
            condition: 1,
            missingParts: false,
            lastPerformed: null,
            notes: ""
          });

          setFormErrors({});
}

export default clearForm;