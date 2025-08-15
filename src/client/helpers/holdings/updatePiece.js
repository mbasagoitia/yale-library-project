const updatePiece = async (info, id) => {
    const apiUrl = `https://localhost:5000/api/holdings-data/${id}`;

      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ info }),
      });
  
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
  
      const updatedPiece = await res.json();
      return updatedPiece;
  };
  
  export default updatePiece;
  