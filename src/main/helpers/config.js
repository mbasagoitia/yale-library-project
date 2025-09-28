const fs = require("fs");
const path = require("path");

function normalizeValue(key, value) {
  if (value === undefined) return undefined;

  switch (key) {
    case "APP_DEV_MODE":
    case "HTTPS":
      return value === true || value === "true";

    case "PORT":
    case "WDS_SOCKET_PORT":
    case "API_PORT":
    case "DB_PORT":
      return Number(value);

    case "APP_MODE":
    case "API_BASE":
    case "HOST":
    case "DB_HOST":
    case "DB_USER":
    case "DB_PW":
    case "DB_DATABASE":
    case "JWT_SECRET":
    case "SQLITE_FILE":
      return String(value);

    default:
      return value;
  }
}

function loadAppConfig() {
  let appConfig = {};

  try {
    const configPath = path.join(process.resourcesPath, "config.json");
    if (fs.existsSync(configPath)) {
      appConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    }
  } catch (err) {
    console.warn("No config.json found, using environment vars instead");
  }

  const keys = [
    "APP_MODE",
    "APP_DEV_MODE",
    "HTTPS",
    "HOST",
    "API_BASE",
    "PORT",
    "WDS_SOCKET_PORT",
    "API_PORT",
    "DB_HOST",
    "DB_USER",
    "DB_PW",
    "DB_DATABASE",
    "DB_PORT",
    "JWT_SECRET",
  ];

  const normalized = {};
  for (const key of keys) {
    normalized[key] = normalizeValue(key, appConfig[key] ?? process.env[key]);
  }

  return {
    ...normalized,
    isDev: normalized.APP_DEV_MODE === true,
  };
}

const { isDev, ...appConfig } = loadAppConfig();

module.exports = {
  appConfig,
  isDev,
};
