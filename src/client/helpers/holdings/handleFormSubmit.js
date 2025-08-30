import { toast } from "react-toastify";

const handleFormSubmit = async (formData, id, onSubmit) => {
    try {
      if (id) {
        // Update the existing piece
        return await onSubmit(formData, id);
      } else {
        // Add a new piece
        return await onSubmit(formData);
      }
    } catch (error) {
      toast.error("Error submitting form:", error);
    }
  };
  
  export default handleFormSubmit;
  