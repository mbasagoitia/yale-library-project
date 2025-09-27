const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv");

const { isDev } = require("../main/helpers/config.js");

// Routers
const pieceRouter = require("./routes/pieceRouter.js");
const resourceRouter = require("./routes/resourceRouter.js");
const adminRouter = require("./routes/adminRouter.js");
const authRouter = require("./routes/authRouter.js");
const reportRouter = require("./routes/reportRouter.js");
const backupRouter = require("./routes/backupRouter.js");

// Custom middlewares
const { authenticateAdmin } = require("./middlewares/authenticateAdmin.js");
const { errorHandler } = require("./middlewares/errorHandler.js");

// Database connection (handles dev/production and demo/internal logic internally)
const makeKnex = require("./database/knex.js");

// Environment setup
if (isDev) {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// CORS
app.use(
  cors({
    origin: isDev ? "http://localhost:3000" : true,
    credentials: true,
  })
);

// Database injection
const db = makeKnex();
app.use((req, _res, next) => {
  req.db = db;
  next();
});

// Request logger
app.use((req, _res, next) => {
  console.log(`[GLOBAL] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/resources", resourceRouter);
app.use("/api/holdings-data", pieceRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", authenticateAdmin, adminRouter);
app.use("/api/report-data", authenticateAdmin, reportRouter);
app.use("/api/backup", authenticateAdmin, backupRouter);

// Static file serving React build
if (isDev) {
  app.use(express.static(path.join(__dirname, "../client/build")));
} else {
  const buildRoot = process.resourcesPath || path.resolve(__dirname, "../../build");
  const buildPath = path.join(buildRoot, "build");

  app.use(express.static(buildPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// Error handler
app.use(errorHandler);

// Graceful shutdown
const shutdown = async () => {
  console.log("Shutting down server...");
  await db.destroy();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

module.exports = app;
