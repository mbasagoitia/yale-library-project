import { useEffect, useState, useRef } from 'react';
import jwtDecode from 'jwt-decode';
import { logout } from '../../../redux/authSlice';
import { useDispatch } from 'react-redux';

const TokenExpiryHandler = ({ renewToken }) => {
  const [secondsLeft, setSecondsLeft] = useState(null);
  const countdownInterval = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let timeoutId;

    const setupTokenWatcher = async () => {
      try {
        const token = await window.api.auth.getToken();
        if (!token) return;

        const { exp } = jwtDecode(token);
        if (!exp) return;

        const expiryTimeMs = exp * 1000;
        const currentTimeMs = Date.now();
        const msUntilExpiry = expiryTimeMs - currentTimeMs;

        if (msUntilExpiry <= 0) {
          handleLogout();
          return;
        }

        const countdownStart = expiryTimeMs - 30 * 1000;

        if (currentTimeMs >= countdownStart) {
          const seconds = Math.ceil((expiryTimeMs - currentTimeMs) / 1000);
          setSecondsLeft(seconds);
          startCountdown(seconds);
        } else {
          timeoutId = setTimeout(() => {
            setSecondsLeft(30);
            startCountdown(30);
          }, countdownStart - currentTimeMs);
        }
      } catch (err) {
        console.error('Token check/setup failed:', err);
      }
    };

    setupTokenWatcher();

    return () => {
      clearTimeout(timeoutId);
      clearInterval(countdownInterval.current);
    };
  }, []);

  const startCountdown = (initialSeconds) => {
    setSecondsLeft(initialSeconds);

    countdownInterval.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          alert('Your session has expired. You will be logged out.');
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogout = () => {
    dispatch(logout());
    window.api.auth.clear?.();
  };

  const handleRenew = async () => {
    clearInterval(countdownInterval.current);
    setSecondsLeft(null);

    try {
      const result = await renewToken();
      if (result.success && result.token) {
        const { exp } = jwtDecode(result.token);
        const msUntilExpiry = exp * 1000 - Date.now();
        if (msUntilExpiry > 30 * 1000) {
          const timeoutId = setTimeout(() => {
            setSecondsLeft(30);
            startCountdown(30);
          }, msUntilExpiry - 30 * 1000);
        } else {
          setSecondsLeft(Math.ceil(msUntilExpiry / 1000));
          startCountdown(Math.ceil(msUntilExpiry / 1000));
        }
      } else {
        alert('Failed to renew session, please log in again.');
        handleLogout();
      }
    } catch (err) {
      alert('Error renewing session, please log in again.');
      handleLogout();
    }
  };

  if (secondsLeft === null) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      background: '#fff',
      padding: '1em',
      border: '1px solid black',
      borderRadius: '4px',
      zIndex: 9999
    }}>
      <p>Your session will expire in {secondsLeft} second{secondsLeft !== 1 ? 's' : ''}.</p>
      <button onClick={handleRenew}>Renew Session</button>
    </div>
  );
};

export default TokenExpiryHandler;
