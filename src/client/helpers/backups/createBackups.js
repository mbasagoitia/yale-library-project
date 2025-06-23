
const handleCreateCSVBackup = async () => {
    const result = await window.api.backup.createReadable();
    alert(result.message);
}


const handleCreateMysqlDump = async () => {
    const result = await window.api.backup.createMySQL();
    alert(result.message);
}

const handleBackupScans = async () => {
    try {
      const zipPath = await window.api.backup.zipCatalogue();
      alert(`Digital catalogue successfully backed up to:\n${zipPath}`);
    } catch (err) {
      alert(`Failed to back up digital catalogue:\n${err.message}`);
      console.error(err);
    }
};

export {
    handleCreateCSVBackup,
    handleCreateMysqlDump,
    handleBackupScans
}