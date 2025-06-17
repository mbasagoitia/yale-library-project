const fetchReportData = async (reportType, options = {}) => {
    let apiUrl = `http://localhost:5000/api/report-data/${reportType}`;
  
    if (reportType === 'performance-history' && options.years) {
      apiUrl += `?years=${options.years}`;
    }
  
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) {
        throw new Error(`Error fetching report: ${res.status}`);
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
  export default fetchReportData;
  