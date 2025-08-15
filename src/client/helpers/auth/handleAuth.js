import { logout } from '../../../redux/authSlice';
import { persistor } from '../../../redux/store';
import { toast } from "react-toastify";

const openLoginWindow = () => {
    if (window.api?.auth.openLoginWindow) {
      window.api.auth.openLoginWindow();
    } else {
      toast.error("Electron API not available");
    }
}

const handleLogout = async (dispatch, navigate) => {

  try {
    dispatch(logout());
    await persistor.purge();

    if (window.api?.auth.clear) {
      await window.api.auth.clear();
    }
    navigate('/');

  } catch (err) {
    toast.error('Failed to clear auth state');
  }
};

export {
  openLoginWindow,
  handleLogout
};