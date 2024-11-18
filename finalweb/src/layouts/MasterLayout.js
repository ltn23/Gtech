import React, { useState } from "react";
import "../assets/css/styles.css";

import "../assets/js/scripts.js";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Navbar.js";
import Sidebar from "./Sidebar.js";

import routes from "../routes/routes.js";

const MasterLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="sb-nav-fixed">
      <Navbar toggleSidebar={toggleSidebar} />
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <Sidebar isSidebarOpen={isSidebarOpen} />
        </div>
        <div
          style={{ backgroundColor: "#F0F0F0", minHeight: "100vh" }}
          id="layoutSidenav_content"
        >
          <Routes>
            {routes.map((route, idx) => (
              <Route
                key={idx}
                path={route.path}
                element={route.element}
                name={route.name}
              />
            ))}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MasterLayout;
