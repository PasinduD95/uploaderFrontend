
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from 'react-icons/fa';
import './sidebar.css';

const menuItems = [
  {
    category: "File Uploader",
    items: [
      { name: "Upload", href: "/upload", current: false },
      { name: "View", href: "/view", current: false }
    ]
  },
  {
    category: "Poll Creator",
    items: [
      { name: "Create poll", href: "/createpoll", current: false },
      { name: "View Table", href: "/polltable", current: false }
    ]
  }
];

const SideBar = ({ isLoginPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    "File Uploader": true,
    "Poll Creator": true
  });
  
  const location = useLocation(); 

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSection = (category) => {
    setCollapsedSections({
      ...collapsedSections,
      [category]: !collapsedSections[category]
    });
  };

  useEffect(() => {
    // Check if current path is in the "File Uploader" or "Poll Creator" section
    if (location.pathname.includes("upload") || location.pathname.includes("view")) {
      setCollapsedSections(prevState => ({
        ...prevState,
        "File Uploader": false, 
      }));
    } else if (location.pathname.includes("createpoll") || location.pathname.includes("polltable")) {
      setCollapsedSections(prevState => ({
        ...prevState,
        "Poll Creator": false, 
      }));
    }
  }, [location.pathname]); 

  return (
    <div className="flex">
      {!isLoginPage && (
        <div className="flex">
          <div className={`sidebar ${!isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="sidebar-header">
              <button onClick={toggleSidebar} className="text-white text-l">
                {!isOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>

            {!isOpen && (
              <ul className="sidebar-menu">
                {menuItems.map((category) => (
                  <li key={category.category}>
                    <button
                      onClick={() => toggleSection(category.category)}
                      className="w-full py-3 px-4 flex justify-between items-center"
                    >
                      {category.category}
                      <span>{collapsedSections[category.category] ? '+' : '-'}</span>
                    </button>

                    {/* Show sub-menu items if the section is expanded */}
                    {!collapsedSections[category.category] && (
                      <ul className="pl-4">
                        {category.items.map((item) => (
                          <li key={item.name}>
                            <NavLink
                              to={item.href}
                              className="text-white hover:bg-blue-500 py-2 px-4 block"
                              activeclassname="bg-blue-700"
                            >
                              - {item.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;


