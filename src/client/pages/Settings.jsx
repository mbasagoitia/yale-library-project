import { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import FolderSelectButton from "../components//digital-catalogue/FolderSelectButton";
import addNewAdmin from "../helpers/auth/addNewAdmin";

const Settings = () => {
  const [adminInfo, setAdminInfo] = useState({ name: "", netid: "" });
  const [successMsg, setSuccessMsg] = useState("");
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
    

    window.api?.events.on("basePath-updated", handleBasePathUpdate);

    return () => {
      window.api?.events.remove("basePath-updated", handleBasePathUpdate);
    };

  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();

    if (!adminInfo.name || !adminInfo.netid) {
      alert("Please make sure to fill out all fields.");
      return;
    }

    const result = await addNewAdmin(adminInfo);
    if (result?.message) {
      setSuccessMsg(result.message);
      setAdminInfo({ name: "", netid: "" });
      setTimeout(() => setSuccessMsg(""), 5000);
    }
  };

const handleCreateCSVBackup = async () => {
    const result = await window.api.backup.createReadable();
    alert(result.message);
}


const handleCreateMysqlDump = async () => {
    const result = await window.api.backup.createMySQL();
    alert(result.message);
}

const handleBackupScans = async () => {
    try {
      const zipPath = await window.api.backup.zipCatalogue();
      alert(`Scans folder successfully backed up to:\n${zipPath}`);
    } catch (err) {
      alert(`Failed to back up scans folder:\n${err.message}`);
      console.error(err);
    }
  };


  return (
    <Container className="mt-4">
      <h1 className="mb-4">Settings</h1>
      <h2>Set Digital Catalogue Folder</h2>
      <Card className="mb-4">
        <Card.Body>
          <FolderSelectButton />
          <div className="mt-4">Current Path: {basePath}</div>
        </Card.Body>
      </Card>
      <h2>Add New Admin</h2>
      <Card className="mb-4">
        <Card.Body>
          {successMsg && <Alert variant="success">{successMsg}</Alert>}
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
      <h2>Export Holdings Data</h2>
      <Card className="mb-4">
        <Card.Body>
        <Card.Text>
            Create a backup of the current holdings database. This file can be stored externally to preserve data or transfer it to another system.
        </Card.Text>
        <div className="d-flex holdings-buttons-container">
          <Button variant="primary" onClick={handleCreateCSVBackup}>
              Export as CSV
          </Button>
          <Button variant="primary" onClick={handleCreateMysqlDump}>
              Export full Database
          </Button>
          <Button variant="primary" onClick={handleBackupScans}>
              Export Digital Catalogue
          </Button>
        </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Settings;
