import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./client/pages/Home.jsx";
import Header from "./client/components/Header.jsx";
import Navigation from "./client/components/Navigation.jsx";
import ManageHoldings from './client/pages/ManageHoldings.jsx';
import './App.css';


function App() {

  return (
    <BrowserRouter>
    <div className="App">
      <Header />
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manage-holdings" element={<ManageHoldings />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
