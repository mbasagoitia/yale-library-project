const addComposer = (info) => {
    const apiUrl = "http://localhost:5000/api/composer-data";
    
    return fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(info)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        res.json();
    })
    .catch(error => {
        console.error('Error adding composer:', error);
    });
}

export default addComposer;