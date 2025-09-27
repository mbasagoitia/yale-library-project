import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./redux/authSlice";
import {
  HashRouter,
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Button } from "react-bootstrap";
import Header from "./client/components/general/Header.jsx";
import Navigation from "./client/components/navigation/Navigation.jsx";
import Modal from "./client/components/general/Modal.jsx";
import Home from "./client/pages/Home.jsx";
import ClassificationGuide from "./client/pages/ClassificationGuide.jsx";
import DigitalCatalogue from "./client/pages/DigitalCatalogue.jsx";
import ManageHoldings from "./client/pages/ManageHoldings.jsx";
import Settings from "./client/pages/Settings.jsx";
import Browse from "./client/pages/Browse.jsx";
import PieceInfo from "./client/pages/PieceInfo.jsx";
import Reports from "./client/pages/Reports.jsx";
import TokenExpiryHandler from "./client/components/general/TokenExpiryHandler.jsx";
import handleRenewToken from './client/helpers/auth/handleRenewToken.js';
import { fetchHoldings } from "../src/redux/librarySlice";
import { ToastContainer, toast } from "react-toastify";
import SetupWizard from "./client/pages/SetupWizard.jsx";
import RequireCataloguePath from "./client/components/general/RequireCataloguePath.jsx";
import cfg from "./config/appConfig.js";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/global/App.css";

function App() {
  const isDemo = cfg.isDemo;
  const isDev = process.env.REACT_APP_DEV_MODE === "true";

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const hasAttachedAuthListeners = useRef(false);

  const [authModal, setAuthModal] = useState(false);
  const [initialSetup, setInitialSetup] = useState(null);

  const Router = isDev ? BrowserRouter : HashRouter;

  // Check if initial setup is complete to show setup wizard or not
  useEffect(() => {
    const checkInitialSetup = async () => {
      try {
        const result = await window.api.setup.getInitialSetup();
        setInitialSetup(result);
      } catch (error) {
        setInitialSetup(false);
      }
    };

    checkInitialSetup();
  }, []);

  // Setup for demo user; automatic login
  useEffect(() => {
    if (!isDemo) return;
    dispatch(login({ netid: "demo", isAdmin: true, token: null }));
    const shown = localStorage.getItem("demoToastShown");
    if (!shown) {
      toast.success("Welcome, demo user!");
      localStorage.setItem("demoToastShown", "true");
    }
  }, [dispatch, isDemo]);

  // Attach auth listeners only once
  useEffect(() => {
    if (isDemo || hasAttachedAuthListeners.current) return;
    hasAttachedAuthListeners.current = true;

    const handleAuthSuccess = (_, data) => {
      if (!data?.netid || !data?.token) {
        toast.error("Login failed: Invalid user data or missing token");
        return;
      }
      dispatch(
        login({
          netid: data.netid,
          isAdmin: data.isAdmin,
          token: data.token,
        })
      );
      toast.success(`Welcome back, ${data.netid}!`);
      if (!data?.isAdmin) setAuthModal(true);
    };

    const handleAuthFailure = (_, data) => {
      toast.error(data?.reason || "Login failed. Please try again.");
    };

    window.api?.events.on("auth-success", handleAuthSuccess);
    window.api?.events.on("auth-failed", handleAuthFailure);

    return () => {
      window.api?.events.remove("auth-success", handleAuthSuccess);
      window.api?.events.remove("auth-failed", handleAuthFailure);
    };
  }, [dispatch, isDemo]);

  useEffect(() => {
    dispatch(fetchHoldings());
  }, [dispatch]);

  const closeAuthModal = () => setAuthModal(false);

  function BaseLayout() {
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    return (
      <div className="App">
        <Header />
        <div className="hero"></div>
        <Navigation />
        <Outlet />
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

  function PaddedLayout() {
    return (
      <div className="page-content">
        <Outlet />
      </div>
    );
  }

  if (initialSetup === null) {
    return <div>Loading...</div>;
  }

  if (!initialSetup && !isDemo) {
    return <SetupWizard />;
  }

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />

      <Modal
        show={authModal}
        header={<h1>No Admin Permission</h1>}
        content={
          <div className="auth-modal-content m-4 text-center">
            <p>
              You have successfully logged in with your Yale credentials. You
              can view and explore the Philharmonia library catalogue, but only
              users with administrative privileges can make changes or manage
              holdings. Please refer to the user manual if you need admin
              access.
            </p>
            <div className="d-flex justify-content-center">
              <Button variant="secondary" onClick={closeAuthModal}>
                Close
              </Button>
            </div>
          </div>
        }
        handleCloseModal={closeAuthModal}
      />

      <RequireCataloguePath>
        <Routes>
          {!isDemo && <Route path="/setup" element={<SetupWizard />} />}
          <Route element={<BaseLayout />}>
            <Route index element={<Home />} />
            <Route element={<PaddedLayout />}>
              <Route path="classification-guide" element={<ClassificationGuide />} />
              <Route path="manage-holdings" element={<ManageHoldings />} />
              <Route path="browse-holdings" element={<Browse />} />
              <Route path="settings" element={<Settings />} />
              <Route path="browse-holdings/:id" element={<PieceInfo />} />
              <Route path="digital-catalogue" element={<DigitalCatalogue />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Route>
        </Routes>
      </RequireCataloguePath>
    </Router>
  );
}

export default App;
