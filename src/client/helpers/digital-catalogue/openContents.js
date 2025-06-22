const handleOpenFile = async (selectedPDF) => {
    const result = await window.api.filesystem.openFile(selectedPDF);
    if (!result.success) alert(`Could not open file: ${result.error}`);
};

const handleOpenCurrentFolder = async (basePath, currentPath) => {
    const fullPath = await window.api.filesystem.getFullPath(basePath, currentPath);
    const result = await window.api.filesystem.openFolder(fullPath);
    if (!result.success) alert(`Could not open folder: ${result.error}`);
};

export {
    handleOpenFile,
    handleOpenCurrentFolder
}