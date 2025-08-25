const { BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");
const https = require("https");

// Path to mkcert root CA
const caPath = path.join(
  process.env.HOME,
  "Library",
  "Application Support",
  "mkcert",
  "rootCA.pem"
);

// HTTPS agent that trusts mkcert CA
const httpsAgent = new https.Agent({
  ca: fs.readFileSync(caPath),
});

let authWin = null;

const createAuthWindow = (targetWin, store) => {
  if (authWin) {
    authWin.focus();
    return;
  }

  let loginCompleted = false;
  let closingForRedirect = false;

  authWin = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    modal: false,
    resizable: true,
    minimizable: true,
    maximizable: false,
    closable: true,
    title: "Yale CAS Login",
    autoHideMenuBar: true,
    frame: true,
    titleBarStyle: "default",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const serviceUrl = "https://yourapp.local/verify";
  const casLoginUrl = `https://secure.its.yale.edu/cas/login?service=${encodeURIComponent(serviceUrl)}`;

  authWin.loadURL(casLoginUrl);

  authWin.once("ready-to-show", () => authWin?.show());

  authWin.on("closed", () => {
    authWin = null;
    // Only send "Cancelled login" if user manually closed the window
    if (!loginCompleted && !closingForRedirect && targetWin && !targetWin.isDestroyed()) {
      targetWin.webContents.send("auth-failed", { reason: "Cancelled login" });
    }
  });

  authWin.webContents.on("before-input-event", (e, input) => {
    const isCmdOrCtrl = input.meta || input.control;
    if (
      input.type === "keyDown" &&
      (input.key === "Escape" || (isCmdOrCtrl && input.key.toLowerCase() === "w"))
    ) {
      e.preventDefault();
      authWin?.close();
    }
  });

  authWin.webContents.on("will-redirect", (event, url) => {
    const ticketMatch = url.match(/[?&]ticket=([^&]+)/);
    if (!ticketMatch) return;

    const ticket = ticketMatch[1];
    event.preventDefault();

    closingForRedirect = true; // flag to prevent "Cancelled login"
    authWin.close();

    // Dynamically import node-fetch and use custom https agent
    import("node-fetch").then(({ default: fetch }) => {
      fetch(`https://localhost:5000/api/auth/validate-ticket?ticket=${encodeURIComponent(ticket)}`, {
        agent: httpsAgent,
      })
        .then((res) => res.json())
        .then((data) => {
          if (!targetWin || targetWin.isDestroyed()) return;

          if (data.success) {
            store.set("authToken", data.token);
            store.set("netid", data.netid);
            store.set("isAdmin", data.isAdmin);

            targetWin.webContents.send("auth-success", {
              token: data.token,
              netid: data.netid,
              isAdmin: data.isAdmin,
            });

            loginCompleted = true;
          } else {
            targetWin.webContents.send("auth-failed", { reason: "Invalid credentials" });
          }
        })
        .catch((err) => {
          console.error(err);
          if (targetWin && !targetWin.isDestroyed()) {
            targetWin.webContents.send("auth-failed", {
              reason: "An error occurred while validating your login. Please try again.",
            });
          }
        });
    });
  });
};

const closeAuthWindow = () => {
  if (authWin && !authWin.isDestroyed()) {
    authWin.close();
  }
};

module.exports = {
  createAuthWindow,
  closeAuthWindow,
};
