const isEmpty = (obj) => {
    return Object.keys(obj).length === 0 || true;
  };

const handleShowCall = (mainInfo, setShowCall, setFormErrors) => {
    const { medium, composer, genre, publisher } = mainInfo;

    /* Even though I generate the call number behind the scenes and it's technically fine for these fields to be empty for the 
    generateCallNum function, I still want the user to only record a "finished" version and therefore have all fields filled out */
    if (!isEmpty(medium) && !isEmpty(composer) && !isEmpty(genre) && !isEmpty(publisher)) {

      setShowCall(true);
    } else {
      setFormErrors({ requiredCallFieldsWarning: "Please fill in all required fields." });
    }
  };

export default handleShowCall;