const BrowserWindow = require("electron");

let AuthWindow = new BrowserWindow({
  width: 800,
  height: 600,
  show: true,
  webPreferences: {
    nodeIntegration: false
  }
})

const casLoginUrl = "https://secure.its.yale.edu/cas/login?service=https://yourapp.local/verify"

AuthWindow.loadURL(casLoginUrl)

module.exports = AuthWindow;