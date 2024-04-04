
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import CartPage from './components/CartPage/CartPage'; 
import Details from './components/Details/Details'; 
import Order from './components/Order/order'; 
import RegistrationPage from './components/RegistrationPage/RegistrationPage';
import FeedbackForm from './components/Feedback/FeedbackForm';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const username = localStorage.getItem('username');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Dashboard username={username} />} />
        <Route path='/' element={<LoginPage />}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/register' element={<RegistrationPage />}></Route>
        <Route path="/details/:id" element={<Details />}></Route>
        <Route path='/cart' element={<CartPage />}></Route>
        <Route path='/order' element={<Order/>}></Route>
        <Route path='/feedbackform' element={<FeedbackForm/>}></Route>
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
