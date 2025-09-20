import { toast } from "react-toastify";
import cfg from "../../../config/appConfig";

const isDemo = cfg.isDemo;

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const addComposer = async (info) => {
  const url = `${API_BASE}/api/resources/composer-data`;

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
      body: JSON.stringify(info),
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      toast.error(data.error || data.message || "Failed to add composer");
    }

    return data;
  } catch (error) {
    toast.error(error.message || "An error occurred while adding composer");
  }
};

export default addComposer;
