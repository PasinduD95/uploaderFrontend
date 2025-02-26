import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    const token = localStorage.getItem('username');

    if (!token) {
      navigate('/');
      // setIsAuthenticated(true);
    } 
  }, [navigate]);


  return children;
};

export default ProtectedRoute;
