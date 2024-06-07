import express from "express";
import session from 'express-session';
import * as expressSession from "express-session";
import expressMySqlSession from "express-mysql-session";
const MySQLStore   = expressMySqlSession(expressSession);

// Import routes

import path from 'path';
import { join } from "path";
import { fileURLToPath } from 'url';
import morgan from "morgan";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import mysql from 'mysql2/promise';

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan("dev"));

app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/build")));

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const pool = mysql.createPool(); 

const sessionStore = new MySQLStore({}, pool);

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

// Use relevant routers
app.use("/api", apiRouter);

app.use((req, res, next) => {
  try {
    res.sendFile(join(__dirname, "../client/build/index.html"));
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

const port = process.env.port || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});