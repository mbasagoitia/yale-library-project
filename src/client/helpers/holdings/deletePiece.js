const deletePiece = async (id) => {
    const apiUrl = `http://localhost:5000/api/holdings-data/${id}`;
      const res = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong while deleting piece");
      }
  
      const result = await res.json();
      return result;
  };
  
  export default deletePiece;
  