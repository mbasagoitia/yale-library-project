const Store = require('electron-store').default;
const store = new Store();

function setBasePath(path) {
  store.set('basePath', path);
}

function getBasePath() {
  const path = store.get('basePath');
  if (!path) {
    throw new Error("Base path is not set. Please select a Digital Catalogue root folder.");
  }
  return path;
}

module.exports = {
  setBasePath,
  getBasePath,
};
