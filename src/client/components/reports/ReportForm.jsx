import { useState } from 'react';
import { Form, Button, Dropdown, ButtonGroup, } from 'react-bootstrap';
import fetchReportData from '../../helpers/reports/fetchReportData';
import generateReport from '../../helpers/reports/generateReports';

const ReportForm = () => {
  // Report types: all holdings, missing parts, poor condition, condition summary, by composer, performance history
  const [reportType, setReportType] = useState('');
  // If performance history is selected, how many years back do you want to analyze?
  const [years, setYears] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportType) return;

    const options = reportType === 'performance-history' ? { years } : {};
    const data = await fetchReportData(reportType, options);

    if (data) {
      generateReport({ reportType, holdings: data });
    }
  };
//  Adjust logic for setting dropdown, style with css. See composerfilter
  return (
    <div className="my-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="reportType" className="mb-3">
          <Form.Label>Select Type</Form.Label>
          <Dropdown as={ButtonGroup} className="w-100">
            <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setReportType("all")}>All Holdings</Dropdown.Item>
              <Dropdown.Item onClick={() => setReportType("missing")}>Missing Parts</Dropdown.Item>
              <Dropdown.Item onClick={() => setReportType("poor-condition")}>Poor Condition</Dropdown.Item>
              <Dropdown.Item onClick={() => setReportType("condition-summary")}>Condition Summary</Dropdown.Item>
              <Dropdown.Item onClick={() => setReportType("music-by-composer")}>Music by Composer</Dropdown.Item>
              <Dropdown.Item onClick={() => setReportType("performance-history")}>Performance History</Dropdown.Item>
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

        <Button variant="primary" type="submit">Generate Report</Button>
      </Form>
    </div>
  );
};

export default ReportForm;
