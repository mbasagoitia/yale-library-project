import { useState } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import reportTypes from "../helpers/reports/reportTypes";
import handleGenerate from "../helpers/reports/handleGenerate";
import "../../assets/styles/pages/ReportsPage.css";

const Reports = () => {
  const [years, setYears] = useState("");

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
                      onClick={() => handleGenerate(report.type, years)}
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
