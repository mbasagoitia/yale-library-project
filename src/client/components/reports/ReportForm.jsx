import { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import fetchReportData from '../../helpers/reports/fetchReportData';
import generateReport from '../../helpers/reports/generateReports';

const ReportForm = () => {
  const [reportType, setReportType] = useState('');
  const [years, setYears] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportType) return;

    const options = reportType === 'performance-history' ? { years } : {};
    const data = await fetchReportData(reportType, options);

    if (data) {
      generateReport({ reportType, holdings: data });
    } else {
      alert('Failed to fetch report data.');
    }
  };

  return (
    <Container className="my-4">
      <h3 className="mb-4">Generate Report</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="reportType" className="mb-3">
          <Form.Label>Select Type</Form.Label>
          <Form.Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            <option value="all">All Holdings</option>
            <option value="missing">Missing Parts</option>
            <option value="poor-condition">Poor Condition</option>
            <option value="condition-summary">Condition Summary</option>
            <option value="music-by-composer">Music by Composer</option>
            <option value="performance-history">Performance History</option>
          </Form.Select>
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
    </Container>
  );
};

export default ReportForm;
