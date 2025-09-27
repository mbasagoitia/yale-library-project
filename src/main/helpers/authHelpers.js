const { appConfig } = require("../helpers/config.js");
const API_BASE = appConfig.API_BASE;

const renewToken = async (store) => {
    try {
      const token = store.get('authToken');
      if (!token) {
        // console.log('No auth token found');
      }
      const response = await fetch(`http://${API_BASE}/api/auth/renew-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        // console.log(`Failed to renew token: ${response.status} ${errorText}`);
      }
  
      const data = await response.json();
  
      if (!data.token) {
        // console.log('No token returned from renew-token endpoint');
      }
  
      store.set('authToken', data.token);
      // console.log("set auth token in store");
  
      return { success: true, token: data.token, netid: data.netid, isAdmin: data.isAdmin };
  
    } catch (error) {
      return { success: false, message: error.message };
    }
}

module.exports = {
    renewToken
}