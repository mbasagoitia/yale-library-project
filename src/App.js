import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from "./client/components/Header.jsx";
import Navigation from "./client/components/Navigation.jsx";
import Home from "./client/pages/Home.jsx";
import ClassificationGuide from './client/pages/ClassificationGuide.jsx';
import ManageHoldings from './client/pages/ManageHoldings.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function App() {

  return (
    <BrowserRouter>
    <div className="App">
      <Header />
      <Navigation />
      <div className="page-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="classification-guide" element={<ClassificationGuide />} />
        <Route path="/manage-holdings" element={<ManageHoldings />} />
      </Routes>
      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;
