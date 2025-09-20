import { handleCreateCSVBackup, handleBackupScans } from "../../helpers/backups/createBackups";
import { Button, Card } from "react-bootstrap";

const BackupDataForm = () => {
    return (
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
              <Button variant="primary" onClick={handleBackupScans}>
                  Export Digital Catalogue
              </Button>
            </div>
          </Card.Body>
        </Card.Body>
      </Card>
    )
}

export default BackupDataForm;