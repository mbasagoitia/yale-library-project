
import { toast } from 'react-toastify';

const handleCreateCSVBackup = async () => {
    const result = await window.api.backup.createReadable();
    if (!result.success) {
    toast.error(`Backup failed: ${result.message}`);
    } else {
    toast.success(`Backup saved to ${result.filePath}`);
    }

}


const handleCreateMysqlDump = async () => {
    const result = await window.api.backup.createMySQL();
        if (!result.success) {
        toast.error(`Backup failed: ${result.message}`);
        } else {
        toast.success(`Backup saved to ${result.filePath}`);
        }

}

const handleBackupScans = async () => {
    const result = await window.api.backup.zipCatalogue();
    if (!result.success) {
      toast.error(`Failed to back up digital catalogue:\n${result.message}`);
      console.error(result.message);
    } else {
      toast.success(`Digital catalogue successfully backed up to:\n${result.filePath}`);
    }
  };

export {
    handleCreateCSVBackup,
    handleCreateMysqlDump,
    handleBackupScans
}