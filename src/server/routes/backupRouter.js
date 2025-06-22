const express = require("express");
router = express.Router();
const { readableBackup, mysqlDump } = require("../controllers/backupController.js");

router.get('/readable', readableBackup);
router.get("/mysqldump", mysqlDump);

module.exports = router;