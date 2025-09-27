const path = require("path");
const fs = require("fs");

const app = require('./server');
const { isDev, appConfig } = require("../main/helpers/config.js");

// Determine environment and DB location
const dbPath = isDev
  ? path.join(__dirname, "../assets/demo/demo.db")
  : path.join(process.resourcesPath || __dirname, "demo.db");

// DEBUG: print environment info
console.log("====================================");
console.log("STARTING SERVER");
console.log("APP_MODE:", appConfig.APP_MODE);
console.log("isDev:", isDev);
console.log("Database path:", dbPath);
console.log("Database exists:", fs.existsSync(dbPath));
console.log("====================================");

const port = Number(appConfig.API_PORT) || 5000;

app.listen(port, () => {
  console.log(`API running on http://localhost:${port} in ${appConfig.APP_MODE} mode`);
});

module.exports = app;
