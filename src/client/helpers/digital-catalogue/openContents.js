import { toast } from 'react-toastify';

const handleOpenFile = async (selectedPDF) => {
    const result = await window.api.filesystem.openFile(selectedPDF);
    if (!result.success) toast.error(`Could not open file: ${result.error}`);
};

const handleOpenCurrentFolder = async (currentPath) => {
    const result = await window.api.filesystem.openFolder(currentPath);
    if (!result.success) toast.error(`Could not open folder: ${result.error}`);
};

export {
    handleOpenFile,
    handleOpenCurrentFolder
}