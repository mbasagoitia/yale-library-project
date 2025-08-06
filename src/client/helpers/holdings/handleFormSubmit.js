import { toast } from "react-toastify";
// this needs to return the object!
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
      console.error("Form submission error:", error);
      toast.error("Error processing the form.");
    }
  };
  
  export default handleFormSubmit;
  