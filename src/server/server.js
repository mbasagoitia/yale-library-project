const APP_MODE = process.env.APP_MODE || 'demo';

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const pieceRouter = require('./routes/pieceRouter.js');
const resourceRouter = require('./routes/resourceRouter.js');
const adminRouter = require('./routes/adminRouter.js');
const authRouter = require('./routes/authRouter');
const reportRouter = require('./routes/reportRouter.js');
const backupRouter = require('./routes/backupRouter.js');

const { authenticateAdmin } = require('./middlewares/authenticateAdmin.js');
const { errorHandler } = require('./middlewares/errorHandler.js');

// Knex factory
const makeKnex = require('./db/knex');

const app = express();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'https://yourapp.local:3000',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../client/build')));

// mysql connection for internal mode
let db = null;       
let knex = null;

if (APP_MODE === 'internal') {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  });

  db.connect((err) => {
    if (err) throw err;
    // console.log('Connected to MySQL database');
  });

  app.use((req, _res, next) => {
    req.db = db;
    next();
  });
} else {
  // DEMO → use SQLite via Knex; attach on req.knex
  knex = makeKnex();
  app.use((req, _res, next) => {
    req.knex = knex;
    next();
  });
}

app.use('/api/resources', resourceRouter);
app.use('/api/holdings-data', pieceRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', authenticateAdmin, adminRouter);
app.use('/api/report-data', authenticateAdmin, reportRouter);
app.use('/api/backup', authenticateAdmin, backupRouter);

app.use(errorHandler);

process.on('SIGINT', async () => {
  try {
    if (db) db.end();
    if (knex) await knex.destroy();
  } finally {
    process.exit(0);
  }
});

module.exports = app;
