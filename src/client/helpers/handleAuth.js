import { logout } from '../../redux/authSlice';
import { persistor } from '../../redux/store';

const openLoginWindow = () => {
    if (window.electronAPI?.openAuthWindow) {
      window.electronAPI.openAuthWindow();
    } else {
      console.error("Electron API not available");
    }
}

const handleLogout = (dispatch) => {
  dispatch(logout());
  persistor.purge();
};

export {
  openLoginWindow,
  handleLogout
};