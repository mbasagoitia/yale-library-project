import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { login } from './redux/authSlice';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from "./client/components/general/Header.jsx";
import Navigation from "./client/components/general/Navigation.jsx";
import Home from "./client/pages/Home.jsx";
import ClassificationGuide from './client/pages/ClassificationGuide.jsx';
import DigitalCatalogue from './client/pages/DigitalCatalogue.jsx';
import ManageHoldings from './client/pages/ManageHoldings.jsx';
import Settings from './client/pages/Settings.jsx';
import Browse from './client/pages/Browse.jsx';
import PieceInfo from './client/pages/PieceInfo.jsx';
import Reports from './client/pages/Reports.jsx';
import TokenExpiryHandler from './client/components/general/TokenExpiryHandler.jsx';
import handleRenewToken from './client/helpers/auth/handleRenewToken.js';
import { fetchHoldings } from '../src/redux/librarySlice';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function App() {

  const dispatch = useDispatch();
  const hasAttachedAuthListeners = useRef(false);
  
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    if (hasAttachedAuthListeners.current) return;
    hasAttachedAuthListeners.current = true;

    const handleAuthSuccess = (_event, data) => {
      if (!data?.netid) {
        toast.error("Login failed: Invalid user data");
        return;
      }

      dispatch(login({ netid: data.netid, isAdmin: data.isAdmin }));
      toast.success(`Welcome back, ${data.netid}!`);
    };

    const handleAuthFailure = (_event, data) => {
      toast.error(data?.reason || 'Login failed. Please try again.');
    };

    window.api?.events.on('auth-success', handleAuthSuccess);
    window.api?.events.on('auth-failed', handleAuthFailure);

    return () => {
      window.api?.events.remove('auth-success', handleAuthSuccess);
      window.api?.events.remove('auth-failed', handleAuthFailure);
    };
  }, [dispatch]);
  
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await window.api.auth.getToken();
        setAuthToken(token);
      } catch (err) {
        toast.error("Failed to fetch auth token");
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    dispatch(fetchHoldings());
  }, [dispatch]);
  
  return (
    <BrowserRouter>
    <div className="App">
      <Header />
      <div className="hero"></div>
      <Navigation />
      <div className="page-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="classification-guide" element={<ClassificationGuide />} />
        <Route path="/manage-holdings" element={<ManageHoldings />} />
        <Route path="/browse-holdings" element={<Browse />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/browse-holdings/:id" element={<PieceInfo />} />
        <Route path="/digital-catalogue" element={<DigitalCatalogue />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
      <TokenExpiryHandler token={authToken} dispatch={dispatch} renewToken={handleRenewToken} />
    </div>
    </BrowserRouter>
  );
}

export default App;
