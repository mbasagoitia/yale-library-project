const deletePiece = (id) => {
    const apiUrl = `http://localhost:5000/api/holdings-data/${id}`;
    
    return fetch(apiUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        res.json();
    })
    .catch(error => {
        console.error('Error deleting piece from catalogue:', error);
    });
};

export default deletePiece;