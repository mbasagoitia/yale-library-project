import { Container, Row, Col } from "react-bootstrap";
import NewAdminForm from "../components/settings/NewAdminForm";
import "../../assets/styles/pages/SettingsPage.css";
import UpdateBasePathForm from "../components/settings/UpdateBasePathForm";
import BackupDataForm from "../components/settings/BackupDataForm";

const Settings = () => {
  return (
    <Container className="settings">
      <Row>
        <Col>
          <h1 className="mb-5">Settings</h1>
          <h2>Set Digital Catalogue Folder</h2>
          <UpdateBasePathForm />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <h2>Add New Admin</h2>
          <NewAdminForm />
        </Col>
        <Col lg={6}>
          <h2>Export Holdings Data</h2>
          <BackupDataForm />
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;