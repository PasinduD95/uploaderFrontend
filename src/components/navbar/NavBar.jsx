
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import './navbar.css';
import { FaPowerOff } from 'react-icons/fa';


const menuItems = [
  { name: "Upload", href: "/upload", current: false },
  { name: "View", href: "/view", current: false },
];

const PowerIcon = () => (
  <FaPowerOff className="items-center w-4 h-4 text-white hover:text-blue-300" />
);

const NavBar = ({ isLoginPage }) => {

  const [isOpen, setIsOpen] = useState(false);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {

    try {
      const response = await fetch('http://localhost:4000/api/auth/logout', {
        method: 'POST',
        credentials: 'include', 
      });

      const data = await response.json();

      if (data.success) {
        // Clear user data from localStorage 
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
      } else {
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="navbar-gradient p-4">
      
      {isLoginPage && (
          <div className="container justify-end flex items-center mr-[45px]">
          <div className="container justify-start flex items-center ml-auto">
            <a className="flex items-center justify-start">
              <img src="/Image2.png" alt="Logo" className="w-9 ml-[30px]" />
              <span className="ml-2 font-bold text-white text-xl"></span>
            </a>
            </div></div>
        )}

        {!isLoginPage && (
          <div className="container justify-end flex items-center mx-auto mr-[45px]">
          <div className="flex items-center space-x-4">
            {/* Username and Power Icon */}
            {username && (
              <div className="flex items-center space-x-2 text-white mr-[20px]">
                <span className="mr-[10px]">{username}</span>
                <button onClick = { handleLogout }>
                <PowerIcon /></button>
              </div>
            )}
            <img src="sltlogo.png" alt="SLT Logo" className="w-[60px] mr-[30px]" />
            {/* SLT Logo */}
          </div></div>
        )}
            {/* <div className="flex items-center justify-end"> */}
              {/* <img src="sltlogo.png" alt="SLT Logo" className="w-[60px] mr-[30px]" /> */}
            {/* </div> */}
          {/* </div> */}
         </nav>
    );
  };
  
export default NavBar;