const addNewAdmin = async (info) => {
    const apiUrl = "http://localhost:5000/api/admin";
    const token = await window.api.auth.getToken();
  
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify(info)
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong while adding the admin.');
      }
  
      return data;
    } catch (error) {
      console.error('Error adding new admin:', error);
      alert(error.message || 'An error occurred.');
    }
  };
  
  export default addNewAdmin;
  