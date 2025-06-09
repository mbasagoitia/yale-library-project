const handleSelectBasePath = async () => {
    const selectedPath = await window.electronAPI.selectBasePath();
    if (selectedPath) {
      alert(`Base path set to: ${selectedPath}`);
      // Optionally update some local React state to reflect this
    }
  };

const FolderSelectButton = () => {

  return (
    <div>
      <button onClick={handleSelectBasePath}>Set Digital Library Folder</button>
    </div>
  );
}

export default FolderSelectButton;