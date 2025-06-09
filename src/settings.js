const Store = require('electron-store').default;
const store = new Store();

function setBasePath(path) {
  store.set('basePath', path);
}

function getBasePath() {
  return store.get('basePath');
}

module.exports = {
  setBasePath,
  getBasePath,
};
