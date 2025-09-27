const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const fetchHoldings = async () => {
  const apiUrl = `${API_BASE}/api/holdings-data`;

  try {
    const res = await fetch(apiUrl);
    // console.log("Response status:", res.status, res.statusText, "URL:", res.url);
    const text = await res.text();

    // Try to parse JSON manually
    try {
      return JSON.parse(text);
    } catch (err) {
      throw err;
    }
  } catch (error) {
    console.log(error);
  }
};


export default fetchHoldings;