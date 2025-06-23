const fetchReportData = async (reportType, options = {}) => {
    let apiUrl = `http://localhost:5000/api/report-data/${reportType}`;
    const token = await window.api.auth.getToken();
  
    if (reportType === 'performance-history' && options.years) {
      apiUrl += `?years=${options.years}`;
    }
  
    try {
      const res = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: "include",
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong while generating report.');
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching report data:', error);
      alert(error.message || 'An error occurred.');
    }
  };

  export default fetchReportData;
  