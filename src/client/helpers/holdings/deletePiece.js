const deletePiece = async (id) => {
    const apiUrl = `http://localhost:5000/api/holdings-data/${id}`;
  
    try {
      const res = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
  
      const result = await res.json();
      console.log("Piece deleted successfully:", result.message);
      return result;
    } catch (error) {
      console.error("Error deleting piece from catalogue:", error);
      throw error;
    }
  };
  
  export default deletePiece;
  