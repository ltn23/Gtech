import React from "react";
// import { Routes, Route  } from "react-router-dom";
import "../../assets/admin/css/styles.css";
import "../../assets/admin/js/scripts.js";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import routes from "../../routes/routes.js";

const MasterLayout = () => {
  return (
    <div className="sb-nav-fixed">
      <Navbar />
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <Sidebar />
        </div>
        <div id="layoutSidenav_content">
          <Routes>
            {routes.map((route, idx) => (
              <Route key={idx} path={route.path} element={route.element} name={route.name}/>
            ))}
          </Routes>
        </div>
        < >
          {/* <Footer /> */}
        </>
      </div>
    </div>
  );
};

export default MasterLayout;
