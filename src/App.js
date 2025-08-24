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
import SetupWizard from "./client/pages/SetupWizard.jsx";
import useFolderCheck from "./client/hooks/useFolderCheck.js";
import MissingCatalogueNotice from "./client/components/general/MissingCatalogueNotice.jsx";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./assets/styles/global/App.css";

const isDemo =
  process.env.REACT_APP_APP_MODE === 'demo' ||
  process.env.REACT_APP_CAS_ENABLED === 'false';

function App() {
  const dispatch = useDispatch();
  const hasAttachedAuthListeners = useRef(false);

  const [authToken, setAuthToken] = useState(null);
  const [initialSetupComplete, setInitialSetupComplete] = useState(false);
  const [pathReset, setPathReset] = useState(false);

  useEffect(() => {
    const result = window.api.setup.getInitialSetup();
    setInitialSetupComplete(result);
  }, []);

  const { exists: cataloguePathExists } = useFolderCheck();

  // demo login shortcut
  useEffect(() => {
    if (!isDemo) return;
    dispatch(login({ netid: 'demo', isAdmin: true }));
  }, [dispatch]);

  // attach auth listeners
  useEffect(() => {
    if (isDemo || hasAttachedAuthListeners.current) return;
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

  // fetch token
  useEffect(() => {
    if (isDemo) return;
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

  if (cataloguePathExists === null) {
    return <div>Loading...</div>;
  }

  // Layout for the main app (all routes except /setup)
  function AppLayout() {
    return (
      <div className="App">
        <Header />
        <div className="hero"></div>
        <Navigation />
        <div className="page-content">
          <Routes>
            {/* If catalogue missing, show notice */}
            {!cataloguePathExists && !pathReset && (
              <Route
                path="*"
                element={<MissingCatalogueNotice onPathSet={() => setPathReset(true)} />}
              />
            )}

            {/* Normal app routes */}
            <Route path="/" element={<Home />} />
            <Route path="/classification-guide" element={<ClassificationGuide />} />
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

        {!isDemo && (
          <TokenExpiryHandler
            token={authToken}
            dispatch={dispatch}
            renewToken={handleRenewToken}
          />
        )}
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/setup" element={<SetupWizard />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
