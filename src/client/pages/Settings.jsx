import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import FolderSelectButton from "../components//digital-catalogue/FolderSelectButton";
import addNewAdmin from "../helpers/auth/addNewAdmin";
import { handleCreateCSVBackup, handleCreateMysqlDump, handleBackupScans } from "../helpers/backups/createBackups";
import "../../assets/styles/pages/SettingsPage.css";

const Settings = () => {
  const [adminInfo, setAdminInfo] = useState({ name: "", netid: "" });
  const [basePath, setBasePath] = useState("");

  // This is used twice; make helper function

  // This whole page needs to be broken into different components

  useEffect(() => {
    const fetchBasePath = async () => {
      if (window.api?.filesystem.getBasePath) {
        const result = await window.api.filesystem.getBasePath();
        if (result) {
          setBasePath(result);
        }
      }
    };

    fetchBasePath();
    

    const handleBasePathUpdate = (event, newPath) => {
      setBasePath(newPath);
    };
    

    window.api?.events.on("base-path-updated", handleBasePathUpdate);

    return () => {
      window.api?.events.remove("base-path-updated", handleBasePathUpdate);
    };

  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();

    if (!adminInfo.name || !adminInfo.netid) {
      toast.error("Please make sure to fill out all fields.");
      return;
    }

    const result = await addNewAdmin(adminInfo);
    if (result?.message) {
      toast.success(result.message);
      setAdminInfo({ name: "", netid: "" });
    }
  };


  return (
    <Container className="settings">
      <Row>
        <Col>
          <h1 className="mb-4">Settings</h1>
          <h2>Set Digital Catalogue Folder</h2>
          <Card className="mb-4">
            <Card.Body className="choose-catalogue-folder-container">
              <FolderSelectButton />
              <div className="mt-2">{basePath ? `Current Path: ${basePath}` : "No base path set"}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <h2>Add New Admin</h2>
          <Card className="mb-4">
            <Card.Body>
              <Form onSubmit={handleAddAdmin}>
                <Form.Group className="mb-3" controlId="nameInput">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    value={adminInfo.name}
                    onChange={(e) =>
                      setAdminInfo({ ...adminInfo, name: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="netidInput">
                  <Form.Label>NetID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Yale NetID"
                    value={adminInfo.netid}
                    onChange={(e) =>
                      setAdminInfo({ ...adminInfo, netid: e.target.value })
                    }
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Add New Admin
                </Button>
              </Form>
            </Card.Body>
          </Card>
          </Col>
          <Col lg={6}>
          <h2>Export Holdings Data</h2>
          <Card className="mb-4">
            <Card.Body>
              <Card.Body>
                <p><strong>Export as CSV</strong></p>
                <Card.Text>
                  Download your library data in a simple spreadsheet format. Do this if you want to view or edit your collection in Excel, Google Sheets, or another program. Great for long-term access or migrating to a different system.
                </Card.Text>
                <Button variant="primary" onClick={handleCreateCSVBackup}>
                  Export as CSV
                </Button>
              </Card.Body>
              <Card.Body>
                <p><strong>Full Backup (Database and Digital Catalogue)</strong></p>
                <Card.Text>
                Create a complete backup of this application, including all data, settings, and the digital catalogue. Use this if you plan to reinstall this application later (or on another computer) and want everything restored exactly as it is.
                </Card.Text>
                <div className="holdings-buttons-container">
                  <Button variant="primary" onClick={handleCreateMysqlDump}>
                    Export full Database
                  </Button>
                  <Button variant="primary" onClick={handleBackupScans} disabled={!basePath}>
                      Export Digital Catalogue
                  </Button>
                </div>
              </Card.Body>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
