import { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { handleLogout } from '../../helpers/auth/handleAuth';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const TokenExpiryHandler = ({ renewToken }) => {
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const countdownInterval = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
          handleLogout(dispatch, navigate);
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
            setShowModal(true);
          }, countdownStart - currentTimeMs);
        }
      } catch (err) {
        toast.error('Token check/setup failed:', err);
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
          toast.error('Your session has expired. You will be logged out.');
          handleCloseModal();
          handleLogout(dispatch, navigate);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRenew = async () => {
    clearInterval(countdownInterval.current);
    setSecondsLeft(null);
    setShowModal(false);

    try {
      const result = await renewToken();
      if (result.success && result.token) {
        const { exp } = jwtDecode(result.token);
        const msUntilExpiry = exp * 1000 - Date.now();
        if (msUntilExpiry > 30 * 1000) {
          const timeoutId = setTimeout(() => {
            setSecondsLeft(30);
            startCountdown(30);
            setShowModal(true);
          }, msUntilExpiry - 30 * 1000);
        } else {
          setSecondsLeft(Math.ceil(msUntilExpiry / 1000));
          startCountdown(Math.ceil(msUntilExpiry / 1000));
        }
        toast.success("Successfully renewed session");
        handleCloseModal();
      } else {
        toast.error('Failed to renew session, please log in again.');
        handleLogout(dispatch, navigate);
      }
    } catch (err) {
      toast.error(err);
      handleLogout(dispatch, navigate);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Modal 
      show={showModal}
      header="Session will Expire"
      content={
        <div className="d-flex flex-column align-items-center">
          <p>Your session will expire in {secondsLeft} second{secondsLeft !== 1 ? 's' : ''}.</p>
          <Button onClick={handleRenew}>Renew Session</Button>
        </div>
      }
      handleCloseModal={handleCloseModal}
    />
  );
};

export default TokenExpiryHandler;
