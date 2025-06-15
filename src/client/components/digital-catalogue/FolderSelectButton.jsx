import { Button } from "react-bootstrap";

const handleSelectBasePath = async () => {
  if (!window.electronAPI?.selectBasePath) {
    alert("selectBasePath not available");
    return;
  }

  const selectedPath = await window.electronAPI.selectBasePath();
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