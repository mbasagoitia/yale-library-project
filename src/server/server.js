const express = require('express');
// const session = require('express-session');
// const MySQLStore = require('express-mysql-session')(session);
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
// const nodemon = require('nodemon');
const path = require('path');
const morgan = require('morgan');
// const errorHandler = require('./middlewares/errorHandler.js');

const app = express();

app.use(express.json());


// app.use(nodemon);
app.use(morgan("dev"));

app.use(cors());
app.use(morgan('dev'));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Serve static files from the "client/build" directory
app.use(express.static(path.join(__dirname, "../client/build")));

// Database setup
const db = new sqlite3.Database('./composers.db');

// const dbConfig = {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// };

// const pool = mysql.createPool(); 

// const sessionStore = new MySQLStore({}, pool);

// app.use(
//   session({
//     secret: process.env.SECRET_KEY,
//     resave: false,
//     saveUninitialized: false,
//     store: sessionStore,
//   })
// );

db.serialize(() => {
  db.run("CREATE TABLE user (id INT, name TEXT)");
});

// Use relevant routers
// app.use("/api", apiRouter);

app.use((req, res, next) => {
  try {
    res.sendFile(join(__dirname, "../client/build/index.html"));
  } catch (err) {
    next(err);
  }
});

// app.use(errorHandler);

const port = process.env.port || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});