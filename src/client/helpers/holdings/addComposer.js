import { toast } from "react-toastify";

const addComposer = async (info) => {
  const apiUrl = "https://localhost:5000/api/resources/composer-data";
  
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(info),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Something went wrong while adding composer");
    }

    const data = await res.json();
    return data;

  } catch (error) {
    toast.error(error.message || error.error || "An error occurred while adding composer");
  }
};

export default addComposer;
