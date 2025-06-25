const handleSubmit = async (e, mainInfo, setMainInfo, additionalInfo, setAdditionalInfo, setFormErrors, setShowCall, id, onSubmit) => {
    e.preventDefault();

    const { title, medium, composer, genre, publisher, callNumber } = mainInfo;

    if (title && medium && composer && genre && publisher && callNumber) {
      if (additionalInfo.missingParts && !additionalInfo.notes.trim()) {
        setFormErrors({ missingPartsWarning: "Please specify which parts are missing." });
      } else {
        try {
          const allInfo = { ...mainInfo, ...additionalInfo };

          if (id) {
            await onSubmit(allInfo, id);
          } else {
            await onSubmit(allInfo);
          }

          setShowCall(false)

          setMainInfo({
            title: "",
            identifierLabel: "Op.",
            identifierValue: "",
            number: "",
            medium: {},
            composer: {},
            genre: {},
            publisher: {},
            callNumber: []
          });

          setAdditionalInfo({
            ownPhysical: true,
            ownDigital: false,
            scansUrl: "",
            ownScore: true,
            publicDomain: true,
            condition: 1,
            missingParts: false,
            notes: ""
          });

          setFormErrors({});
        } catch (error) {
          console.error('Catalogue error:', error);
        }
      }
    } else {
      setFormErrors({ requiredFieldsWarning: "Please fill in all required fields." });
    }
  };
