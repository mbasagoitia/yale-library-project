import { useEffect } from 'react';
import { scrollToCallWarning, scrollToRequiredWarning } from '../helpers/catalogue/scrollBehavior.js';

const useScrollOnFormErrors = (formErrors) => {
  useEffect(() => {
    if (formErrors.requiredFieldsWarning) {
      scrollToRequiredWarning();
    }
    if (formErrors.requiredCallFieldsWarning) {
      scrollToCallWarning();
    }
  }, [formErrors]);
};

export default useScrollOnFormErrors;

