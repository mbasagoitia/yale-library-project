const catalogueNew = async (info) => {
    const apiUrl = "http://localhost:5000/api/holdings-data";
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ info }),
      });
  
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong while adding composer");
      }
  
      const newPiece = await res.json();
      return newPiece;
  };
  
  export default catalogueNew;
  