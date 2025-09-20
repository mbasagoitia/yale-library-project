import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/general/Modal';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { handleLogout } from '../../helpers/auth/handleAuth';

const TokenExpiryHandler = ({ token, renewToken, intervalRef, timeoutRef }) => {
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use passed refs if provided, otherwise create internal ones
  const interval = intervalRef
  const timeout = timeoutRef

  useEffect(() => {
    if (!token) {
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      toast.error("Failed to decode token");
      return;
    }

    const expiryTimeMs = decoded.exp * 1000;
    const now = Date.now();
    const msUntilExpiry = expiryTimeMs - now;

    const startCountdown = (seconds) => {
      setSecondsLeft(seconds);
      setShowModal(true);

      interval.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval.current);
            toast.error('Your session has expired. Logging out.');
            setShowModal(false);
            handleLogout(dispatch, navigate);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    if (msUntilExpiry <= 30_000) {
      startCountdown(Math.ceil(msUntilExpiry / 1000));
    } else {
      timeout.current = setTimeout(() => startCountdown(30), msUntilExpiry - 30_000);
    }

    return () => {
      clearInterval(interval.current);
      clearTimeout(timeout.current);
    };
  }, [token, dispatch, navigate]);

  const handleRenew = async () => {
    clearInterval(interval.current);
    clearTimeout(timeout.current);
    setShowModal(false);
    setSecondsLeft(null);

    try {
      const result = await renewToken();
      if (result?.success && result?.token) {
        console.log(result);
        toast.success('Session renewed!');
        dispatch(login({ netid: result.netid, isAdmin: result.isAdmin, token: result.token }));
      } else {
        toast.error('Failed to renew session.');
        handleLogout(dispatch, navigate);
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to renew session.');
      handleLogout(dispatch, navigate);
    }
  };

  return (
    <Modal
      show={showModal}
      header="Session Expiring"
      content={
        <div className="d-flex flex-column align-items-center p-4 session-modal-content">
          <p>
            Your session will expire in {secondsLeft ?? 0} second
            {secondsLeft !== 1 ? 's' : ''}.
          </p>
          <Button onClick={handleRenew}>Renew Session</Button>
        </div>
      }
      handleCloseModal={() => setShowModal(false)}
    />
  );
};

export default TokenExpiryHandler;
