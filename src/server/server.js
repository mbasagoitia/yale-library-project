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

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
