const fetchHoldings = async () => {
    const apiUrl = "http://localhost:5000/api/holdings-data";
    const res = await fetch(apiUrl);
    const data = await res.json();
    return data;
}

export default fetchHoldings;