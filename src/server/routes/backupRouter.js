const express = require("express");
const router = express.Router();
const { readableBackup } = require("../controllers/backupController.js");

router.get('/readable', readableBackup);

module.exports = router;