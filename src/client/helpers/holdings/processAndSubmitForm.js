import validateForm from "./validateForm.js";
import handleFormSubmit from "./handleFormSubmit.js";
import clearForm from "./clearForm.js";

const processAndSubmitForm = async (mainInfo, setMainInfo, additionalInfo, setAdditionalInfo, setFormErrors, setShowCall, id, setMediumResetKey, onSubmit, dispatch, dispatchMethod) => {

  // Validate the form
  const isValid = validateForm(mainInfo, additionalInfo, setFormErrors);

  if (isValid) {
    // Combine main info and additional info into one object
    const allInfo = { ...mainInfo, ...additionalInfo };

    // Submit the form (add or update)
    const res = await handleFormSubmit(allInfo, id, onSubmit);

    // Dispatch to redux store
    dispatchMethod(dispatch, res);

    // Reset the form after submission
    setShowCall(false);
    clearForm(setShowCall, setMainInfo, setAdditionalInfo, setMediumResetKey, setFormErrors);
  }
};

export default processAndSubmitForm;
