import { useState } from 'react';
import { Form, Button, Spinner, Row, Col, Container } from 'react-bootstrap';
import fetchReportData from '../../helpers/reports/fetchReportData';
import generateReport from '../../helpers/reports/generateReports';

const ReportForm = () => {
  const [reportType, setReportType] = useState('');
  const [years, setYears] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportType) return;

    setLoading(true);
    const options = reportType === 'performance-history' ? { years } : {};
    const data = await fetchReportData(reportType, options);
    setLoading(false);

    if (data) {
      generateReport({ reportType, holdings: data });
    } else {
      alert('Failed to fetch report data.');
    }
  };

  return (
    <Container className="my-4">
      <h3 className="mb-4">Generate Library Report</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="reportType" className="mb-3">
          <Form.Label>Select Report Type</Form.Label>
          <Form.Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            <option value="all">All Holdings</option>
            <option value="missing-and-condition">Needs Attention</option>
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

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{' '}
              Generating...
            </>
          ) : (
            'Generate Report'
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default ReportForm;
