import { useState } from 'react';
import { Form, Button, Dropdown, ButtonGroup, } from 'react-bootstrap';
import fetchReportData from '../../helpers/reports/fetchReportData';
import generateReport from '../../helpers/reports/generateReports';

const ReportForm = () => {

  // Report types: all holdings, missing parts, poor condition, condition summary, by composer, performance history
  const [reportType, setReportType] = useState("");
  // If performance history is selected, how many years back do you want to analyze?
  const [years, setYears] = useState('');

  const reports = [
    { type: "all", label: "All Holdings" },
    { type: "missing", label: "Missing Parts" },
    { type: "poor-condition", label: "Poor Condition" },
    { type: "condition-summary", label: "Condition Summary" },
    { type: "music-by-composer", label: "Music by Composer" },
    { type: "performance-history", label: "Performance History" }
  ]

  const isItemSelected = (item) => {
    const type = reportType.type;
    return item.type === type;
  };

  const handleItemClick = (item) => {
    setReportType(item);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportType.type) return;

    const options = reportType.type === 'performance-history' ? { years } : {};
    const data = await fetchReportData(reportType.type, options);

    if (data) {
      const type = reportType.type;
      generateReport({ reportType: type, holdings: data });
    }
  };

  return (
    <div className="my-4 report-form">
      <Form onSubmit={handleSubmit}>
      <div className="reports-btn-wrapper d-flex w-100">
        <Form.Group controlId="reportType" className="mb-3 d-flex flex-column">
          <Form.Label>Select Type</Form.Label>
          <Dropdown as={ButtonGroup} className="w-auto">
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">{reportType?.label || "Select Report Type"}</Dropdown.Toggle>
            <Dropdown.Menu>
              {reports.map((report) => (
              <Dropdown.Item
                key={report.type}
                onClick={() => handleItemClick(report)}
                active={isItemSelected(report)}
              >
                {`${report.label}`}
              </Dropdown.Item>
            ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>

        {reportType === 'performance-history' && (
          <Form.Group controlId="years" className="mb-3">
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
          <Button variant="primary" type="submit" className="generate-report-btn">Generate Report</Button>
        </div>
      </Form>
    </div>
  );
};

export default ReportForm;
