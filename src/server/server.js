const APP_MODE = process.env.APP_MODE || 'demo';

const express = require('express');
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
const makeKnex = require("./database/knex.js");

const app = express();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../client/build')));

const db = makeKnex();

app.use((req, _res, next) => { req.db = db; next(); });
app.use((req, res, next) => {
  console.log("GLOBAL:", req.method, req.url);
  next();
});

app.use('/api/resources', resourceRouter);
app.use('/api/holdings-data', pieceRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', authenticateAdmin, adminRouter);
app.use('/api/report-data', authenticateAdmin, reportRouter);
app.use('/api/backup', authenticateAdmin, backupRouter);

app.use(errorHandler);

process.on('SIGINT', async () => { await db.destroy(); process.exit(0); });

module.exports = app;
