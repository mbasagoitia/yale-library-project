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
      <button onClick={handleSelectBasePath}>Choose...</button>
    </div>
  );
}

export default FolderSelectButton;