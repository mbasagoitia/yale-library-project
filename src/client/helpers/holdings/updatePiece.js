const updatePiece = (info, id) => {
    const apiUrl = `http://localhost:5000/api/holdings-data/${id}`;
    
    return fetch(apiUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ info: info })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        res.json();
    })
    .catch(error => {
        console.error('Error updating catalogue:', error);
    });
};

export default updatePiece;