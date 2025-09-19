function formatDate(value) {
  if (!value) return "";

  // Handle MySQL DATE string (YYYY-MM-DD)
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const d = new Date(value);
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US");
  }

  // Handle JS Date object
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? "" : value.toLocaleDateString("en-US");
  }

  return "";
}

export default formatDate;