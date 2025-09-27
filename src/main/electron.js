const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");
const Store = require("electron-store").default;
const { isDev, appConfig } = require("./helpers/config.js");

const handleFileHandlers = require("./ipcHandlers/fileHandlers.js");
const handleAuthHandlers = require("./ipcHandlers/authHandlers.js");
const handleBackupHandlers = require("./ipcHandlers/backupHandlers.js");
const handleSetupHandlers = require("./ipcHandlers/setupHandlers.js");
const handleExternalHandlers = require("./ipcHandlers/externalHandlers.js");
const { createMainWindow } = require("./helpers/createMainWindow.js");

const store = new Store({
  defaults: {
    initialSetup: false,
    cataloguePath: null,
  },
});

console.log("APP_MODE:", appConfig.APP_MODE);
console.log("initialSetup:", store.get("initialSetup"));

// Start backend server only in production builds
if (!isDev) {
  const serverPath = path.join(__dirname, "../server/startServer.js");
  require(serverPath);
}

let mainWindow;
let setupWindow;

// --------------------
// Setup Window
// --------------------
function createSetupWindow() {
  setupWindow = new BrowserWindow({
    title: "Philharmonia Library Catalogue",
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    resizable: false,
    modal: true,
  });

  if (isDev) {

    setupWindow.loadURL("http://localhost:3000");
  } else {
    setupWindow.loadFile(
      path.join(process.resourcesPath, "build", "index.html")
    );
  }

  setupWindow.on("closed", () => (setupWindow = null));
}

// --------------------
// Main Window
// --------------------
function openMainWindow() {
  mainWindow = createMainWindow();
  mainWindow.on("closed", () => (mainWindow = null));
}

// --------------------
// App Lifecycle
// --------------------
app.commandLine.appendSwitch(
  "disable-features",
  "OutOfBlinkCors,SiteIsolationTrial"
);
app.commandLine.appendSwitch("disable-gpu");

app.whenReady().then(() => {
  const DEV_HOST = process.env.HOST || "localhost";
  const DEV_PORT = Number(process.env.PORT) || 3000;
  const DEV_UI = `http://${DEV_HOST}:${DEV_PORT}`;
  const DEV_WS = `ws://${DEV_HOST}:${DEV_PORT}`;
  const DEV_API = "http://localhost:5000";

  const CSP = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.typeform.com https://public-assets.typeform.com",
    "font-src 'self' data:",
    "script-src 'self' https://*.typeform.com 'unsafe-inline'",
    "frame-src 'self' https://*.typeform.com",
    `connect-src 'self' ${DEV_UI} ${DEV_WS} ${DEV_API}`,
  ].join("; ");
  
  
    // Inject CSP but skip Yale CAS & Duo
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      const url = details.url;
      if (
        url.startsWith("https://secure.its.yale.edu/cas") ||
        url.includes("duosecurity.com")
      ) {
        callback({ responseHeaders: details.responseHeaders });
      } else {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            "Content-Security-Policy": [CSP],
          },
        });
      }
    });

  // Register IPC handlers
  handleFileHandlers(ipcMain, store);
  handleAuthHandlers(ipcMain, store);
  handleBackupHandlers(ipcMain, store);
  handleSetupHandlers(ipcMain, store);
  handleExternalHandlers(ipcMain);

  const needsSetup =
    appConfig.APP_MODE === "internal" && !store.get("initialSetup");

  if (needsSetup) {
    createSetupWindow();
  } else {
    openMainWindow();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      const needsSetup =
        appConfig.APP_MODE === "internal" && !store.get("initialSetup");
      if (needsSetup) createSetupWindow();
      else openMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("setup-complete", () => {
  store.set("initialSetup", true);
  if (setupWindow) setupWindow.close();
  openMainWindow();
});

// --------------------
// Global Helper
// --------------------
global.getDemoDbPath = () => {
  if (isDev) {
    return path.join(__dirname, "../assets/demo/demo.db");
  }
  return path.join(process.resourcesPath, "demo.db");
};
