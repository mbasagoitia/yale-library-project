import { toast } from 'react-toastify';

const addNewAdmin = async (info) => {
  const apiUrl = "https://localhost:5000/api/admin";
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
    toast.error(error.message || error.error || 'An error occurred while adding new admin');
  }
};

export default addNewAdmin;
