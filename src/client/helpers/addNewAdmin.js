const addNewAdmin = (info) => {
    const apiUrl = "http://localhost:5000/api/admin";

    const token = window.auth.getToken();
    
    return fetch(apiUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  
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
        console.error('Error adding new admin:', error);
    });
}

export default addNewAdmin;