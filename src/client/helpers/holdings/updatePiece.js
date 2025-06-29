const updatePiece = async (info, id) => {
    const apiUrl = `http://localhost:5000/api/holdings-data/${id}`;
  
    try {
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
      console.log("Piece updated successfully:", updatedPiece);
      return updatedPiece;
    } catch (error) {
      console.error("Error updating catalogue:", error);
      throw error;
    }
  };
  
  export default updatePiece;
  