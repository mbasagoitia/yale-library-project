const { exportReadableBackup, exportMySQLDump } = require("../helpers/backupHelpers.js");

const readableBackup = async (req, res) => {
  try {
    const db = req.db;
    const filePath = req.query.filePath;

    if (!filePath) {
      return res.status(400).json({ success: false, message: "Missing filePath." });
    }

    const result = await exportReadableBackup(db, filePath);

    if (!result.success) {
      return res.status(500).json({ success: false, message: result.message });
    }

    res.download(filePath, (err) => {
      if (err) {
        console.error("Download error:", err);
        return res.status(500).send("Failed to send readable backup.");
      }
    });
  } catch (err) {
    console.error("Readable backup failed:", err);
    res.status(500).json({ success: false, message: "Failed to create readable backup." });
  }
};

const mysqlDump = async (req, res) => {
  try {
    const filePath = req.query.filePath;

    if (!filePath) {
      return res.status(400).json({ success: false, message: "Missing filePath." });
    }

    const result = await exportMySQLDump(filePath);

    if (!result.success) {
      return res.status(500).json({ success: false, message: result.message });
    }

    res.download(result.filePath, (err) => {
      if (err) {
        console.error("Download error:", err);
        return res.status(500).send("Failed to send MySQL dump.");
      }
      // Again, delete if temp, but likely user path so maybe don't
    });
  } catch (err) {
    console.error("MySQL dump error:", err);
    res.status(500).json({ success: false, message: "Failed to create MySQL dump." });
  }
};

module.exports = {
  readableBackup,
  mysqlDump,
};
