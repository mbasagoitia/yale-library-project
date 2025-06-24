import { logout } from '../../../redux/authSlice';
import { persistor } from '../../../redux/store';

const openLoginWindow = () => {
    if (window.api?.auth.openLoginWindow) {
      window.api.auth.openLoginWindow();
    } else {
      console.error("Electron API not available");
    }
}

const handleLogout = async (dispatch, navigate) => {

  try {
    // Remove all auth related state from redux store
    dispatch(logout());
    persistor.purge();

    if (window.api?.auth.clear) {
      // Clear electron store of auth state
      await window.api.auth.clear();
    }
    // Redirect to home page
    navigate('/');

  } catch (err) {
    console.error('Failed to clear auth state:', err);
  }
};

export {
  openLoginWindow,
  handleLogout
};