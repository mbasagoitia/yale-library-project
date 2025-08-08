const express = require('express');
const { addNewAdmin } = require("../controllers/adminController.js");

const router = express.Router();

router.post('/', (req, res, next) => {
    const db = req.db;
    addNewAdmin(req, res, db, next);
});

module.exports = router;
