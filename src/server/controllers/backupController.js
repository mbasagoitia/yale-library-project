const { exportReadableBackup, exportMySQLDump } = require("../helpers/backupHelpers.js");

const readableBackup = async (req, res) => {
    try {
      const db = req.db;
      const basePath = req.query.basePath;
      const filePath = await exportReadableBackup(db, basePath);
      res.download(filePath);
    } catch (err) {
      console.error('Readable backup failed:', err);
      res.status(500).send("Failed to export readable backup.");
    }
}

const mysqlDump = async (req, res) => {
    try {
      const basePath = req.query.basePath;
  
      if (!basePath) {
        return res.status(400).json({ error: "Missing basePath." });
      }
  
      const dumpFilePath = await exportMySQLDump(basePath);
  
      res.download(dumpFilePath, path.basename(dumpFilePath), (err) => {
        if (err) {
          console.error("Download error:", err);
          res.status(500).send("Failed to send MySQL dump.");
        }
      });
    } catch (err) {
      console.error("MySQL dump error:", err);
      res.status(500).send("Error creating MySQL dump.");
    }
}

module.exports = {
    readableBackup,
    mysqlDump
}