import { logout } from '../../../redux/authSlice';
import { persistor } from '../../../redux/store';

const openLoginWindow = () => {
    if (window.api?.auth.openLoginWindow) {
      window.api.auth.openLoginWindow();
    } else {
      console.error("Electron API not available");
    }
}

const handleLogout = async (dispatch) => {
  try {
    dispatch(logout());
    persistor.purge();

    if (window.api?.auth.clear) {
      await window.api.auth.clear();
    }
  } catch (err) {
    console.error('Failed to clear auth state:', err);
  }
};

export {
  openLoginWindow,
  handleLogout
};