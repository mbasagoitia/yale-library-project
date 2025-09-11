const { shell } = require("electron");

const handleExternalHandlers = (ipcMain) => {

    ipcMain.handle("external:openExternal", (_, url) => {
        shell.openExternal(url);

      return true;
    });
}

module.exports = handleExternalHandlers;
