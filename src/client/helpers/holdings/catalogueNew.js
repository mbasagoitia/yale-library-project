const catalogueNew = (info) => {
    const apiUrl = "http://localhost:5000/api/holdings-data";
    
    return fetch(apiUrl, {
        method: "POST",
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
        alert("Successfully catalogued new piece.")
    })
    .catch(error => {
        console.error('Catalogue error:', error);
    });
};

export default catalogueNew;