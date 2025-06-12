const express = require('express');
const { authenticateAdmin } = require("../middlewares/authenticateAdmin.js");
const { addNewAdmin } = require("../controllers/adminController.js");

const router = express.Router();

router.post('/admin', authenticateAdmin, (req, res) => {
    const db = req.db;
    addNewAdmin(req, res, db);
})

module.exports = router;