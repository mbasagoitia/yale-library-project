import validateForm from "./validateForm.js";
import handleFormSubmit from "./handleFormSubmit.js";
import clearForm from "./clearForm.js";

const processAndSubmitForm = async (mainInfo, setMainInfo, additionalInfo, setAdditionalInfo, setFormErrors, setShowCall, id, onSubmit, dispatch, dispatchMethod) => {
    try {
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
        clearForm(setShowCall, setMainInfo, setAdditionalInfo, setFormErrors);
        
        return { success: true };
      } else {
        return { success: false, message: "Invalid form submission. Please fix the errors." };
      }
    } catch (error) {
      // Handle any errors during the submission process
      console.error(error);
      return { success: false, message: `Error: ${error.message}` };
    }
  };
  
export default processAndSubmitForm;
