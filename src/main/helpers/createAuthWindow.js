const { BrowserWindow, net } = require("electron");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

function createAuthWindow(parentWindow, store, { casLoginUrl, serviceUrl, backendVerifyUrl }) {
  const win = new BrowserWindow({
    parent: parentWindow,
    modal: false,
    show: true,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
      partition: "persist:auth",
    },
    frame: true,
    titleBarStyle: "default",
    trafficLightPosition: undefined,
    fullscreenable: false   
  });

  const loginUrl = `${casLoginUrl}?service=${encodeURIComponent(serviceUrl)}`;
  win.loadURL(loginUrl);

  // Capture CAS ticket on redirect and send to backend via GET
  win.webContents.on("will-redirect", (event, url) => {
    if (url.startsWith(serviceUrl)) {
      event.preventDefault(); // stop Electron from navigating
      const ticket = new URL(url).searchParams.get("ticket");

      // Build GET URL with query param
      const verifyUrl = `${backendVerifyUrl}?ticket=${encodeURIComponent(ticket)}`;

      const request = net.request(verifyUrl);

      let responseBody = "";
      request.on("response", (response) => {
        response.on("data", (chunk) => {
          responseBody += chunk;
        });
        response.on("end", () => {
          try {
            const data = JSON.parse(responseBody);

            if (data?.success) {
              store.set("authToken", data.token);
              store.set("netid", data.netid);
              store.set("isAdmin", data.isAdmin);
              parentWindow.webContents.send("auth-success", {
                netid: data.netid,
                isAdmin: data.isAdmin,
                token: data.token
              });
            } else {
              parentWindow.webContents.send("auth-failed");
            }
          } catch (err) {
            console.log("[AUTH] Error parsing backend response:", err, responseBody);
          }
          win.close();
        });
      });
      request.end();
    } else {
      console.log("[AUTH] Redirecting to:", url);
    }
  });

  // Dev certs for local HTTPS
  if (process.env.NODE_ENV === "development") {
    const caPath = path.join(__dirname, "certs", "rootCA.pem");
    if (fs.existsSync(caPath)) {
      process.env.NODE_EXTRA_CA_CERTS = caPath;
    }
  }
}

module.exports = { createAuthWindow };
