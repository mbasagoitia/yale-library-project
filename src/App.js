import React, { useState, useEffect } from 'react';
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
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    window.electron?.ipcRenderer?.on('auth-success', (event, data) => {
      dispatch(login({ netid: data.netid, isAdmin: data.isAdmin }));
    });
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
        <Route path="digital-catalogue" element={<DigitalCatalogue />} />
      </Routes>
      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;
