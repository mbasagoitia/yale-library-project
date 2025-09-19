import { useState } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import { FileText, AlertTriangle, Wrench, PieChart, User, History } from "lucide-react";
import fetchReportData from "../helpers/reports/fetchReportData";
import generateReport from "../helpers/reports/generateReports";
import "../../assets/styles/pages/ReportsPage.css";
import { toast } from "react-toastify";

const reportTypes = [
  {
    title: "All Holdings",
    description:
      "View a complete list of the library's holdings and all details including condition, notes, acquisition date, etc.",
    icon: <FileText size={24} />,
    type: "all",
  },
  {
    title: "Missing Parts",
    description:
      "Identify all holdings that contain missing parts. Helps to plan replacement purchases.",
    icon: <AlertTriangle size={24} />,
    type: "missing",
  },
  {
    title: "Poor Condition",
    description:
      "Track items that are in poor or fair condition. Prioritize repairs or replacements to maintain integrity.",
    icon: <Wrench size={24} />,
    type: "poor-condition",
  },
  {
    title: "Condition Summary",
    description:
      "Get a snapshot of the overall condition of your holdings. Monitor the health of your library over time.",
    icon: <PieChart size={24} />,
    type: "condition-summary",
  },
  {
    title: "By Composer",
    description:
      "Filter the collection by composer to see which pieces you have from each one.",
    icon: <User size={24} />,
    type: "music-by-composer",
  },
  {
    title: "Performance History",
    description:
      "Review the history of performances tied to specific pieces. Track usage and plan future programs.",
    icon: <History size={24} />,
    type: "performance-history",
  },
];

const Reports = () => {
  const [years, setYears] = useState("");

  const handleGenerate = async (reportType) => {
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

  return (
    <div className="reports">
      <div className="reports-header">
        <h1>Library Reports</h1>
      </div>

      <Row className="report-page-container">
        <Col md={12}>
          <Row className="mt-3">
            {reportTypes.map((report, idx) => (
              <Col sm={6} lg={4} key={idx} className="mb-3 d-flex report-col">
                <Card className="report-type-card">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div className="d-flex align-items-start mb-2">
                      <div>
                        <span className="icon-wrapper">{report.icon}</span>
                        <h2 className="text-center d-inline">{report.title}</h2>
                        <p className="mt-4 mb-2">{report.description}</p>
                      </div>
                    </div>

                    {report.type === "performance-history" && (
                      <Form.Group
                        controlId="years"
                        className="mb-2"
                      >
                        <Form.Label>Number of Years</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          value={years}
                          onChange={(e) => setYears(e.target.value)}
                          required
                        />
                      </Form.Group>
                    )}
                    <div className="d-flex mt-2 justify-content-center">
                    <Button
                      variant="primary"
                      onClick={() => handleGenerate(report.type)}
                    >
                      Generate Report
                    </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
