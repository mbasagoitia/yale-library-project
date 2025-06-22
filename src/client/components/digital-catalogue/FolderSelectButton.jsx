import { Button } from "react-bootstrap";

const handleSelectBasePath = async () => {
  if (!window.api?.filesystem.selectBasePath) {
    alert("selectBasePath not available");
    return;
  }

  const selectedPath = await window.api.filesystem.selectBasePath();
  if (selectedPath) {
    alert(`Base path set to: ${selectedPath}`);
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