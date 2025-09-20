import { toast } from "react-toastify";
import cfg from "../../../config/appConfig";

const isDemo = cfg.isDemo;

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const fetchReportData = async (reportType, options = {}) => {
  const params = new URLSearchParams();
  if (reportType === "performance-history" && options.years != null) {
    params.set("years", String(options.years));
  }
  const url = `${API_BASE}/api/report-data/${encodeURIComponent(
    reportType
  )}${params.toString() ? `?${params.toString()}` : ""}`;

  const headers = {};
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
      method: "GET",
      headers,
      credentials: "include",
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      toast.error(data.error || data.message || "Failed to fetch report data");
    }
    return data;
  } catch (error) {
    toast.error(error.message || "An error occurred fetching report data");
  }
};

export default fetchReportData;
