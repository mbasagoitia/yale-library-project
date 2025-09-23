const { BrowserWindow, net } = require("electron");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

function createAuthWindow(parentWindow, store, { casLoginUrl, serviceUrl, backendVerifyUrl }) {
  let win = new BrowserWindow({
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

  // Capture CAS ticket on redirect and send to backend
  win.webContents.on("will-redirect", (event, url) => {
    if (!win || win.isDestroyed()) return;

    if (url.startsWith(serviceUrl)) {
      event.preventDefault();
      const ticket = new URL(url).searchParams.get("ticket");

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

              if (parentWindow && !parentWindow.isDestroyed()) {
                parentWindow.webContents.send("auth-success", {
                  netid: data.netid,
                  isAdmin: data.isAdmin,
                  token: data.token
                });
              }
            } else {
              if (parentWindow && !parentWindow.isDestroyed()) {
                parentWindow.webContents.send("auth-failed");
              }
            }
          } catch (err) {
            console.error("Auth parse error:", err);
          }

          if (win && !win.isDestroyed()) {
            win.close();
          }
        });
      });

      request.on("error", (err) => {
        console.error("Auth request failed:", err);
      });

      request.end();
    }
  });

  win.on("closed", () => {
    win = null;
  });
}

module.exports = { createAuthWindow };
