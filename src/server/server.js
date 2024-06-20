const express = require('express');
const mysql = require("mysql2");
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const dotenv = require("dotenv");
const composerRouter = require("./routes/composerRouter.js");
const pieceRouter = require("./routes/pieceRouter.js");
const resourceRouter = require("./routes/resourceRouter.js");
// const nodemon = require("nodemon");

const app = express();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

app.use(express.json());
app.use(morgan("dev"));
// app.use(nodemon);

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "../client/build")));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_DATABASE
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Middleware to add db to request object
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Eventually add composers route to resource router?
app.use("/api", composerRouter);
app.use("/api", resourceRouter);
app.use("/api", pieceRouter);


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
