import { useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import cfg from "../../../config/appConfig";

const UpdateBasePathForm = () => {

  const [basePath, setBasePath] = useState("");
  const isDemo = cfg.isDemo;

  useEffect(() => {

    // Fetch current path to display
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

  // Select a new base path
  const handleSelectBasePath = async () => {
    if (!isDemo) {
      const defaultPath = "";
      try {
        const newPath = await window.api.filesystem.chooseFolder(defaultPath);
        if (newPath) {
          await window.api.filesystem.setBasePath(newPath);
          toast.success("Successfully updated base path");
        }
      } catch (error) {
        toast.error(error);
      }
    }
  };

  return (
    <Card className="mb-4">
        <Card.Body className="choose-catalogue-folder-container">
        <div>
            <Button variant="primary" type="button" className="text-nowrap" onClick={handleSelectBasePath} disabled={isDemo}>
                Choose Folder
            </Button>
        </div>
        <div 
            className="mt-lg-1 mt-3 text-truncate bp-text-container" 
            // tooltip for full path on hover in case it gets chopped off
            title={basePath}
          >
            {basePath ? `Current Path: ${basePath}` : "No base path set"}
          </div>
    </Card.Body>
  </Card>
  )

}

export default UpdateBasePathForm;