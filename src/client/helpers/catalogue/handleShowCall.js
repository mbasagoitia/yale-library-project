const isEmpty = (obj) => {
    return Object.keys(obj).length === 0 || true;
  };

// actually calculate call num again in case something has changed
// Will need to pass in some additional state here

const handleShowCall = (mainInfo, setShowCall, setFormErrors) => {
    const { medium, composer, genre, publisher } = mainInfo;

    /* Even though I generate the call number behind the scenes and it's technically fine for these fields to be empty for the 
    generateCallNum function, I still want the user to only record a "finished" version and therefore have all fields filled out */
    if (medium && composer && genre && publisher) {
      if (!isEmpty(medium) && !isEmpty(composer) && !isEmpty(genre) && !isEmpty(publisher)) {
        setShowCall(true);
      } else {
        setFormErrors({ requiredCallFieldsWarning: "Please fill in all required fields." });
      }
    } else {
      setFormErrors({ requiredCallFieldsWarning: "Please fill in all required fields." });
    }
  };

export default handleShowCall;