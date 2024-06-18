const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const composerRouter = require("./routes/composerRouter");
// const nodemon = require("nodemon");

const app = express();

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

app.use("/api", composerRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
