const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(morgan('dev'));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "../client/build")));

// const db = new sqlite3.Database('philharmonia_library.db', (err) => {
//   if (err) {
//       console.error('Error opening database', err);
//   } else {
//       console.log('Connected to SQLite database.');
//       db.run(`CREATE TABLE IF NOT EXISTS holdings (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           title TEXT,
//           composer TEXT,
//           parts TEXT,
//           available BOOLEAN
//       )`);
//   }
// });

// const mediumData = require("./dataToInsert/medium.json");

// const publishersData = require('./dataToInsert/publishers.json');
// const speciesData = require('./dataToInsert/species.json');

db.serialize(() => {

});

db.close();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
