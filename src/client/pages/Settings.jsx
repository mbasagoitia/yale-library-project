import { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import FolderSelectButton from "../components/FolderSelectButton";
import addNewAdmin from "../helpers/addNewAdmin";

const Settings = () => {
  const [adminInfo, setAdminInfo] = useState({ name: "", netid: "" });
  const [successMsg, setSuccessMsg] = useState("");

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

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Settings</h1>
      <h2>Set Digital Catalogue Folder</h2>
      <Card className="mb-4">
        <Card.Body>

          <FolderSelectButton />
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
                placeholder="Enter NetID"
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
        <Button variant="primary" type="submit">
            Export
        </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Settings;
