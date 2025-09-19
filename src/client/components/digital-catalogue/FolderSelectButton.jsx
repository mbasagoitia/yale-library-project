import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

const FolderSelectButton = () => {

  const isDemo =
  process.env.REACT_APP_APP_MODE === 'demo' ||
  process.env.REACT_APP_CAS_ENABLED === 'false';

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
    <div>
      <Button variant="primary" type="button" onClick={handleSelectBasePath} disabled={isDemo}>
        Choose Folder
      </Button>
    </div>
  );
}

export default FolderSelectButton;