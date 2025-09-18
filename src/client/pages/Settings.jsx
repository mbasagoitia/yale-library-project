import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import FolderSelectButton from "../components/digital-catalogue/FolderSelectButton";
import addNewAdmin from "../helpers/auth/addNewAdmin";
import { handleCreateCSVBackup, handleBackupScans } from "../helpers/backups/createBackups";
import "../../assets/styles/pages/SettingsPage.css";

const Settings = () => {
  const [adminInfo, setAdminInfo] = useState({ name: "", netid: "" });
  const [basePath, setBasePath] = useState("");

  useEffect(() => {
    const fetchPath = async () => {
        if (window.api.filesystem?.getBasePath) {
            const { exists, basePath } = await window.api.filesystem.getBasePath();
            if (exists) {
                setBasePath(basePath);
            }
        }
    }
    fetchPath();
    
    const handleBasePathUpdate = (_event, newPath) => {
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
              <div className="mt-lg-1 mt-3">{basePath ? `Current Path: ${basePath}` : "No base path set"}</div>
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
                <div className="holdings-buttons-container">
                  <Card.Text>
                  Create and compress a backup of the digital library catalogue. Store in Google Drive or another safe location. This process may take a few minutes.
                  </Card.Text>
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





