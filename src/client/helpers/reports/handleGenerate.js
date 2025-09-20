import fetchReportData from "../../helpers/reports/fetchReportData";
import generateReport from "../../helpers/reports/generateReports";
import { toast } from "react-toastify";

const handleGenerate = async (reportType, years) => {
    const options =
      reportType === "performance-history" ? { years } : {};

    if (reportType === "performance-history") {
      if (!years) {
        toast.warn("Please enter number of years");
        return;
      }
      if (years < 1) {
        toast.warn("Please enter a positive number of years");
        return;
      }
    }

    const data = await fetchReportData(reportType, options);

    if (data) {
      generateReport({
        reportType,
        holdings: data,
        years: years,
      });
    }
  };

export default handleGenerate;