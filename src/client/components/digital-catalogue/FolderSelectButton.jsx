import { Button } from "react-bootstrap";

const handleSelectBasePath = async () => {
  if (!window.api?.filesystem.selectBasePath) {
    alert("selectBasePath not available");
    return;
  }

  const basePath = await window.api.filesystem.selectBasePath();
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