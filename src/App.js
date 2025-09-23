import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './redux/authSlice';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from "./client/components/general/Header.jsx";
import Navigation from "./client/components/navigation/Navigation.jsx";
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
import cfg from './config/appConfig.js';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./assets/styles/global/App.css";

function App() {

  const isDemo = cfg.isDemo;
  
  const dispatch = useDispatch();
  const hasAttachedAuthListeners = useRef(false);
  const token = useSelector((state) => state.auth.token);
  const [pathReset, setPathReset] = useState(false);

  let { exists: cataloguePathExists } = useFolderCheck();

  // Demo login shortcut
  useEffect(() => {
    if (!isDemo) return;
  
    dispatch(login({ netid: 'demo', isAdmin: true, token: null }));
    const shown = localStorage.getItem("demoToastShown");

    if (!shown) {
      toast.success("Welcome, demo user!");
      localStorage.setItem("demoToastShown", "true");
    }
  }, [dispatch]);

  // Attach auth listeners
  useEffect(() => {
    if (isDemo || hasAttachedAuthListeners.current) return;
    hasAttachedAuthListeners.current = true;

    const handleAuthSuccess = (_event, data) => {
      if (!data?.netid || !data?.token) {
        toast.error("Login failed: Invalid user data or missing token");
        return;
      }
      dispatch(login({ netid: data.netid, isAdmin: data.isAdmin, token: data.token }));
      toast.success(`Welcome back, ${data.netid}!`);
      if (!data?.isAdmin) {
        // Show modal instead
        alert("You successfully logged in with Yale credentials, but you do not have administrative access on this app. Please see the user manual if you need admin privileges.");
      }
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

  // Fetch library holdings
  useEffect(() => {
    dispatch(fetchHoldings());
  }, [dispatch]);

  if (cataloguePathExists === null) {
    return <div>Loading...</div>;
  }

  const handlePathReset = () => {
    setPathReset(true);
    cataloguePathExists = true;
  }

  // Base layout wrapper
  function BaseLayout({ children }) {
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    return (
      <div className="App">
        <Header />
        <div className="hero"></div>
        <Navigation />
        {children}
        {!isDemo && token && (
          <TokenExpiryHandler
            token={token}
            renewToken={handleRenewToken}
            intervalRef={intervalRef}
            timeoutRef={timeoutRef}
          />
        )}
      </div>
    );
  }

  // Layout for padded pages
  function PaddedLayout() {
    return (
      <div className="page-content">
        <Outlet />
      </div>
    );
  }

  return (
<BrowserRouter>
  <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable 
      />
  {(!isDemo && !cataloguePathExists && !pathReset) ? (
    <MissingCatalogueNotice onPathSet={handlePathReset} />
  ) : (
    <Routes>
      {!isDemo && <Route path="setup" element={<SetupWizard />} />}
      <Route
        path="/"
        element={
          <BaseLayout>
            <Home />
          </BaseLayout>
        }
      />
      <Route
        element={
          <BaseLayout>
            <PaddedLayout />
          </BaseLayout>
        }
      >
        <Route path="/classification-guide" element={<ClassificationGuide />} />
        <Route path="/manage-holdings" element={<ManageHoldings />} />
        <Route path="/browse-holdings" element={<Browse />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/browse-holdings/:id" element={<PieceInfo />} />
        <Route path="/digital-catalogue" element={<DigitalCatalogue />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  )}
</BrowserRouter>

  );
}

export default App;
