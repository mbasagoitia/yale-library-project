const renewToken = async (store) => {
    try {
      const token = store.get('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }
  
      const response = await fetch('http://localhost:5000/api/auth/renew-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to renew token: ${response.status} ${errorText}`);
      }
  
      const data = await response.json();
  
      if (!data.token) {
        throw new Error('No token returned from renew-token endpoint');
      }
  
      store.set('authToken', data.token);
  
      return { success: true, token: data.token };
  
    } catch (error) {
      return { success: false, message: error.message };
    }
}

module.exports = {
    renewToken
}