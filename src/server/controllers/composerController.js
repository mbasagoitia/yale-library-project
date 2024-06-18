const sqlite3 = require('sqlite3').verbose();
const path = require("path");
const db = new sqlite3.Database( path.resolve(__dirname, '../database/philharmonia_library.db') );

const getComposerData = (req, res) => {
    const query = 'SELECT * FROM composers';
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(rows);
    });
};

module.exports = {
    getComposerData,
};
