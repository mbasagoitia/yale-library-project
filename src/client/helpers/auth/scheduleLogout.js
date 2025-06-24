import jwtDecode from "jwt-decode";
import { handleLogout } from "./handleAuth";

export const scheduleLogout = (token, dispatch, renewToken, showCountdown) => {
  try {
    const { exp } = jwtDecode(token);
    if (!exp) return;

    const expiryTime = exp * 1000;
    const currentTime = Date.now();

    // 30 seconds before jwt expiration time
    const warningTimeMs = 30 * 1000;

    const timeUntilExpiry = expiryTime - currentTime;

    if (timeUntilExpiry <= 0) {
      alert("Your session has expired. You will be logged out.");
      handleLogout(dispatch);
      return;
    }

    const startCountdown = (countdownSeconds) => {
      showCountdown(countdownSeconds);

      const intervalId = setInterval(() => {
        countdownSeconds -= 1;

        if (countdownSeconds <= 0) {
          clearInterval(intervalId);
          showCountdown(null);
          alert("Your session has expired. You will be logged out.");
          handleLogout(dispatch);
          return;
        }

        showCountdown(countdownSeconds);
      }, 1000);

      return intervalId;
    };

    if (timeUntilExpiry > warningTimeMs) {
      setTimeout(() => {
        startCountdown(30);
      }, timeUntilExpiry - warningTimeMs);
    } else {
      startCountdown(Math.floor(timeUntilExpiry / 1000));
    }
  } catch (err) {
    console.error("Failed to decode token", err);
  }
};

export default scheduleLogout;