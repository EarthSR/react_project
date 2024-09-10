import './App.css';
import Login from './components/Login';
import React from 'react';
import Home from './components/Home'; 
import Register from './components/Register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />         
        </Routes>
      </Router>
    </div>
  );
}

export default App;
