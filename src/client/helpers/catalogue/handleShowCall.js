import generateCallNum from "../../helpers/holdings/generateCallNum.js";

const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };

const handleShowCall = (mainInfo, setMainInfo, setShowCall, setFormErrors) => {
    const { medium, composer, genre, publisher } = mainInfo;

    if (!isEmpty(medium) && !isEmpty(composer) && !isEmpty(genre) && !isEmpty(publisher)) {
      const call = generateCallNum(mainInfo);
      setMainInfo({ ...mainInfo, callNumber: call });
      setShowCall(true);
    } else {
      setFormErrors({ requiredCallFieldsWarning: "Please fill in all required fields." });
    }
  };

export default handleShowCall;