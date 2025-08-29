import { toast } from "react-toastify";

const isDemo =
  process.env.REACT_APP_APP_MODE === "demo" ||
  String(process.env.REACT_APP_CAS_ENABLED).toLowerCase() === "false";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const catalogueNew = async (info) => {
  const url = `${API_BASE}/api/holdings-data`;

  const headers = { "Content-Type": "application/json" };
  if (!isDemo) {
    try {
      const token = await window?.api?.auth?.getToken?.();
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch {
      toast.error("Could not retrieve auth token");
      return;
    }
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ info }),
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      throw new Error(data.error || data.message || "Failed to create piece");
    }

    return data;
  } catch (error) {
    toast.error(error.message || "An error occurred while creating piece");
  }
};

export default catalogueNew;
