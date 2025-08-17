import { Button } from "react-bootstrap";
import { toast } from 'react-toastify';

const handleSelectBasePath = async () => {
  if (!window.api?.filesystem.setBasePath) {
    toast.error("setPath not available");
    return;
  }

  const basePath = await window.api.filesystem.setBasePath();
  if (basePath) {
    toast.success(`Base path set to: ${basePath}`);
  }
};

const FolderSelectButton = ({ disabled }) => {

  return (
    <div>
      <Button variant="primary" type="button" onClick={handleSelectBasePath} disabled={disabled}>
        Choose Folder
      </Button>
    </div>
  );
}

export default FolderSelectButton;