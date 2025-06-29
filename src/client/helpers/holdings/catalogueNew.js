const catalogueNew = async (info) => {
    const apiUrl = "http://localhost:5000/api/holdings-data";
  
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ info }),
      });
  
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
  
      const newPiece = await res.json();
      console.log("New piece from backend:", newPiece);
      alert("Successfully catalogued new piece.");
      return newPiece;
    } catch (error) {
      console.error("Catalogue error:", error);
      throw error;
    }
  };
  
  export default catalogueNew;
  