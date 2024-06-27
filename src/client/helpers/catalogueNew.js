const catalogueNew = (info, mainInfo, additionalInfo) => {
    const apiUrl = "http://localhost:5000/api/holdings-data";
    
    return fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            info: info,
            mainInfo: mainInfo,
            additionalInfo: additionalInfo
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        res.json();
    })
    .catch(error => {
        console.error('Catalogue error:', error);
    });
};

export default catalogueNew;