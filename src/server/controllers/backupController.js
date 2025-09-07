const xss = require('xss');
const { exportReadableBackup } = require("../helpers/backupHelpers.js");

const readableBackup = async (req, res, next) => {
  try {
    const db = req.db;
    let filePath = req.query.filePath;

    if (!filePath) {
      const error = new Error("Missing filePath.");
      error.status = 400;
      return next(error);
    }

    filePath = xss(filePath);

    const result = await exportReadableBackup(db, filePath);

    if (!result.success) {
      const error = new Error(result.message);
      error.status = 500;
      return next(error);
    }

    res.download(filePath, (err) => {
      if (err) {
        const downloadError = new Error("Failed to send readable backup.");
        downloadError.status = 500;
        return next(downloadError);
      }
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  readableBackup
};
