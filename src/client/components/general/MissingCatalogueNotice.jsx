import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { CheckCircle } from "lucide-react";
import "../../../assets/styles/components/MissingCatalogueNotice.css";

const MissingCatalogueNotice = ({ onPathSet }) => {
  const [error, setError] = useState("");
  const [newPathSet, setNewPathSet] = useState(false);

  const handleSelectFolder = async () => {
    try {
      const folderPath = await window.api.filesystem.chooseFolder();
      // console.log("path", folderPath);
      if (folderPath) {
        await window.api.filesystem.setBasePath(folderPath);
        // maybe show a success message and then after a few seconds close the notice
        setNewPathSet(true);
        // wait 3 secs
        await new Promise(resolve => setTimeout(resolve, 3000));
        onPathSet();
      }
    } catch (err) {
      setError("Failed to set new path");
    }
  };

  return (
    <div className="missing-catalogue-notice max-w-xl mx-auto mt-10 d-flex flex-column justify-content-center align-items-center">
      <div className="missing-catalogue-notice-content">
        <Card className="p-6 shadow-lg rounded-2xl h-100">
          <Card.Body className="mb-6">
            <h2 className="text-xl font-semibold">Digital Catalogue Path Missing</h2>
            <p className="text-gray-600 text-center">
              The folder previously set for the digital catalogue has been moved or no longer exists on your system.
              Please select a new folder to continue.
            </p>
            {error && <p className="text-danger">{error}</p>}
            {newPathSet && !error &&
            <div className="flex items-center text-success mb-2">
              <CheckCircle className="mr-2" />
              <p>New path set!</p>
              <p>Redirecting...</p>
            </div>}
            <div>
            <Button
              variant="primary"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow w-auto"
              onClick={handleSelectFolder}
              disabled={newPathSet}
            >
              Select Folder
            </Button>
            </div>
        </Card.Body>
      </Card>
    </div>
    </div>
  );
};

export default MissingCatalogueNotice;
