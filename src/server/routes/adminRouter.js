const express = require("express");
import { addNewAdmin } from "../controllers/adminController";

const router = express.Router();

router.post('/admin', (req, res) => {
    const db = req.db;
    addNewAdmin(req, res, db);
})

export default router;