const validateForm = (mainInfo, additionalInfo, setFormErrors) => {
  const { title, medium, composer, genre, publisher, callNumber } = mainInfo;

  if (!title || !medium || !composer || !genre || !publisher || !callNumber) {
    setFormErrors({ requiredFieldsWarning: "Please fill in all required fields." });
    return false;
  }

  if (additionalInfo.missingParts && !additionalInfo.notes?.trim()) {
    setFormErrors({ missingPartsWarning: "Please specify which parts are missing." });
    return false;
  }

  return true;
};

export default validateForm;
