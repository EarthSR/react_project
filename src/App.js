import './App.css';
import Login from './components/Login';
import React from 'react';
import Home from './components/Home'; 
import Register from './components/Register';
import LoginAdmin from './componentsAdmin/LoginAdmin';
import Management from './componentsAdmin/EmployeeManagement'
import AdminDashboard from './componentsAdmin/AdminDashboard';
import CustomerManagement from './componentsAdmin/CustomerManagement'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginAdmin />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/customermanagement" element={<CustomerManagement />} />
          <Route path="/loginadmin" element={<LoginAdmin />} />
          <Route path="/Management" element={<Management />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<Home />} />     
        </Routes>
      </Router>
    </div>
  );
}

export default App;
