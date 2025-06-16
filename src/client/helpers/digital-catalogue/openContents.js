const handleOpenFile = async (selectedPDF) => {
    const result = await window.electronAPI.openFile(selectedPDF);
    if (!result.success) alert(`Could not open file: ${result.error}`);
};

const handleOpenCurrentFolder = async (basePath, currentPath) => {
    const fullPath = await window.electronAPI.getFullPath(basePath, currentPath);
    const result = await window.electronAPI.openFolder(fullPath);
    if (!result.success) alert(`Could not open folder: ${result.error}`);
};

export {
    handleOpenFile,
    handleOpenCurrentFolder
}