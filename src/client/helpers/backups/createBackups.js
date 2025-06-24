
const handleCreateCSVBackup = async () => {
    const result = await window.api.backup.createReadable();
    if (!result.success) {
    alert(`Backup failed: ${result.message}`);
    } else {
    alert(`Backup saved to ${result.filePath}`);
    }

}


const handleCreateMysqlDump = async () => {
    const result = await window.api.backup.createMySQL();
        if (!result.success) {
        alert(`Backup failed: ${result.message}`);
        } else {
        alert(`Backup saved to ${result.filePath}`);
        }

}

const handleBackupScans = async () => {
    const result = await window.api.backup.zipCatalogue();
    if (!result.success) {
      alert(`Failed to back up digital catalogue:\n${result.message}`);
      console.error(result.message);
    } else {
      alert(`Digital catalogue successfully backed up to:\n${result.filePath}`);
    }
  };

export {
    handleCreateCSVBackup,
    handleCreateMysqlDump,
    handleBackupScans
}