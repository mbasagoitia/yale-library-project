const handleSetupHandlers = (ipcMain, store) => {
    ipcMain.handle('setup:getInitialSetup', () => {
        // Returns boolean
        const initialSetup = store.get('initialSetup');
        return initialSetup;
      });

      ipcMain.handle("setup:reset", () => {
        // Set to false for development
        store.set("initialSetup", false);
        return store.get("initialSetup");
      });
}

module.exports = handleSetupHandlers