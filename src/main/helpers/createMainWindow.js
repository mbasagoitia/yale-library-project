const { BrowserWindow } = require("electron");
const path = require("path");
const { isDev } = require("./config");

function bool(v) { return typeof v === "string" ? v.toLowerCase() === "true" : !!v; }

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Philharmonia Library Catalogue",
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    const startURLFromEnv = process.env.ELECTRON_START_URL;
    const HOST = process.env.HOST || "localhost";
    const PORT = process.env.PORT || 3000;
    const HTTPS = bool(process.env.HTTPS);
    const defaultDevURL = `${HTTPS ? "https" : "http"}://${HOST}:${PORT}`;

    mainWindow.loadURL(startURLFromEnv || defaultDevURL);
  } else {
    mainWindow.loadFile(
      path.join(process.resourcesPath, "build", "index.html")
    );
  }

  return mainWindow;
}

module.exports = { createMainWindow };
