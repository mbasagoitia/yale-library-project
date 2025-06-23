import { Button } from "react-bootstrap";

const handleSelectBasePath = async () => {
  if (!window.api?.filesystem.setBasePath) {
    alert("setPath not available");
    return;
  }

  const basePath = await window.api.filesystem.setBasePath();
  if (basePath) {
    alert(`Base path set to: ${basePath}`);
  }
};

const FolderSelectButton = () => {

  return (
    <div>
      <Button variant="primary" type="button" onClick={handleSelectBasePath}>
        Choose Folder
      </Button>
    </div>
  );
}

export default FolderSelectButton;