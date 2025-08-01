import { useState, useEffect } from 'react';
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
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function App() {

  const dispatch = useDispatch();
  
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const handler = (_event, data) => {
      dispatch(login({ netid: data.netid, isAdmin: data.isAdmin }));
    };
  
    window.api?.events.on('auth-success', handler);
  
    return () => {
      window.api?.events.remove('auth-success', handler);
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await window.api.auth.getToken();
        setAuthToken(token);
      } catch (err) {
        console.error("Failed to fetch token:", err);
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
        {/* put this in a modal or something */}
      <TokenExpiryHandler token={authToken} dispatch={dispatch} renewToken={handleRenewToken} />
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
    </div>
    </BrowserRouter>
  );
}

export default App;
