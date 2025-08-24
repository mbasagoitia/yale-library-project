const handleSetupHandlers = (ipcMain, store) => {
    ipcMain.handle('setup:getInitialSetup', () => {
        // Returns boolean
        const initialSetup = store.get('initialSetup');
        return initialSetup;
      });
}

module.exports = handleSetupHandlers