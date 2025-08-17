import { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { handleLogout } from '../../helpers/auth/handleAuth';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const isDemo =
  process.env.REACT_APP_APP_MODE === 'demo' ||
  String(process.env.REACT_APP_CAS_ENABLED).toLowerCase() === 'false';

const TokenExpiryHandler = ({ renewToken }) => {
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const countdownInterval = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDemo) return;

    let timeoutId;

    const setupTokenWatcher = async () => {
      try {
        const token = await window?.api?.auth?.getToken?.();
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

        const countdownStart = expiryTimeMs - 30_000;

        if (currentTimeMs >= countdownStart) {
          const seconds = Math.ceil((expiryTimeMs - currentTimeMs) / 1000);
          setSecondsLeft(seconds);
          setShowModal(true);
          startCountdown(seconds);
        } else {
          timeoutId = setTimeout(() => {
            setSecondsLeft(30);
            setShowModal(true);
            startCountdown(30);
          }, countdownStart - currentTimeMs);
        }
      } catch (err) {
        toast.error(`Token check/setup failed: ${err?.message || String(err)}`);
      }
    };

    setupTokenWatcher();

    return () => {
      clearTimeout(timeoutId);
      clearInterval(countdownInterval.current);
    };
  }, [dispatch, navigate]);

  const startCountdown = (initialSeconds) => {
    if (isDemo) return;
    setSecondsLeft(initialSeconds);

    clearInterval(countdownInterval.current);
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
    if (isDemo) {
      clearInterval(countdownInterval.current);
      setSecondsLeft(null);
      setShowModal(false);
      return;
    }

    clearInterval(countdownInterval.current);
    setSecondsLeft(null);
    setShowModal(false);

    try {
      const result = await renewToken();
      if (result?.success && result?.token) {
        const { exp } = jwtDecode(result.token);
        const msUntilExpiry = exp * 1000 - Date.now();
        if (msUntilExpiry > 30_000) {
          setTimeout(() => {
            setSecondsLeft(30);
            setShowModal(true);
            startCountdown(30);
          }, msUntilExpiry - 30_000);
        } else {
          const secs = Math.max(1, Math.ceil(msUntilExpiry / 1000));
          setSecondsLeft(secs);
          setShowModal(true);
          startCountdown(secs);
        }
        toast.success('Successfully renewed session');
        handleCloseModal();
      } else {
        toast.error('Failed to renew session, please log in again.');
        handleLogout(dispatch, navigate);
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to renew session');
      handleLogout(dispatch, navigate);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  if (isDemo) return null;

  return (
    <Modal
      show={showModal}
      header="Session will Expire"
      content={
        <div className="d-flex flex-column align-items-center">
          <p>
            Your session will expire in {secondsLeft ?? 0} second
            {secondsLeft !== 1 ? 's' : ''}.
          </p>
          <Button onClick={handleRenew}>Renew Session</Button>
        </div>
      }
      handleCloseModal={handleCloseModal}
    />
  );
};

export default TokenExpiryHandler;
