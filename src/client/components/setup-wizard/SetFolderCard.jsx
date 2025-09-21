import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { CheckCircle, XCircle, Folder } from "lucide-react";

const SetFolderCard = () => {
  const [defaultPath, setDefaultPath] = useState("");
  const [defaultPathExists, setDefaultPathExists] = useState(false);
  const [folderPath, setFolderPath] = useState("");
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const checkDefaultPath = async () => {
      const { exists, path } = await window.api.filesystem.checkDefaultBasePath();
      setDefaultPath(path);
      if (exists) {
        setFolderPath(path);
        await window.api.filesystem.setBasePath(path);
        setDefaultPathExists(true);
      }
      await new Promise((r) => setTimeout(r, 3000));
      setIsScanning(false);
    };
    checkDefaultPath();
  }, []);

  const chooseFolder = async () => {
    const newPath = await window.api.filesystem.chooseFolder("");
    if (newPath) {
      setFolderPath(newPath);
      await window.api.filesystem.setBasePath(newPath);
    }
  };

  return (
    <>
      {isScanning ? (
        <>
          <p className="mb-4">Scanning for folder at:</p>
          <p className="font-monospace path-text mb-4">{defaultPath}</p>
          <div className="flex items-center text-muted mb-4">
            <div className="spinner-border spinner-border-sm mx-2" role="status" />
            Scanning...
          </div>
        </>
      ) : defaultPathExists ? (
        <>
          <p className="mb-4">Scanning for folder at:</p>
          <p className="font-monospace path-text mb-4">{defaultPath}</p>
          <div className="flex items-center text-success mb-4">
            <CheckCircle /> Folder found!
          </div>
        </>
      ) : folderPath ? (
        <>
          <p className="mb-4">Path set to:</p>
          <p className="font-monospace path-text mb-4">{folderPath}</p>
          <div className="flex items-center text-success mb-4 mx-2">
            <CheckCircle /> Folder path set!
          </div>
        </>
      ) : (
        <>
          <p className="mb-4">Scanning for folder at:</p>
          <p className="font-monospace path-text mb-4">{defaultPath}</p>
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex items-center text-danger mb-2 mx-2">
              <XCircle /> Folder not found.
            </div>
            <Button onClick={chooseFolder}>
              <Folder className="mr-2 h-4 w-4" /> Choose Folder
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default SetFolderCard;
