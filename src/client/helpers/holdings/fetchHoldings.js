import { toast } from "react-toastify";

const fetchHoldings = async () => {
    const apiUrl = "https://localhost:5000/api/holdings-data";
    try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Something went wrong while fetching holdings");
          }

        const data = await res.json();
        return data;

    } catch (error) {
    toast.error(error.message || error.error || "An error occurred while fetching holdings");
  }
}

export default fetchHoldings;