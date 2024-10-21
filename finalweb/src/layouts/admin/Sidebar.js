import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState("");
    useEffect(() => {
        const loggedInStatus = localStorage.getItem("isLoggedIn");
        const userRole = localStorage.getItem("role");
      
        if (loggedInStatus === "true") {
          setIsLoggedIn(true);
          setRole(userRole);
        } else {
          setIsLoggedIn(false);
          setRole("");
        }
      }, []);

    
    const menuItems = {
        admin: [
            { to: "/dashboard", label: "Dashboard", icon: "fas fa-tachometer-alt" },
            { to: "/admin-panel", label: "Admin Panel", icon: "fas fa-user-shield" },
            { to: "/user-management", label: "User Management", icon: "fas fa-users" }
        ],
        user: [
            { to: "/dashboard", label: "Dashboard", icon: "fas fa-tachometer-alt" },
            { to: "/profile", label: "Profile", icon: "fas fa-user" },
            { to: "/settings", label: "Settings", icon: "fas fa-cogs" }
        ],
        guest: [
            { to: "/login", label: "Login", icon: "fas fa-sign-in-alt" },
            { to: "/register", label: "Register", icon: "fas fa-user-plus" }
        ]
    };

    const currentMenuItems = menuItems[role] || menuItems["guest"];


    return (
        <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
                <div className="nav">
                    <div className="sb-sidenav-menu-heading">Core</div>
                    {currentMenuItems.map((item, index) => (
                        <Link key={index} className="nav-link" to={item.to}>
                            <div className="sb-nav-link-icon"><i className={item.icon}></i></div>
                            {item.label}
                        </Link>
                    ))}
                    <div className="sb-sidenav-menu-heading">Addons</div>
                    <Link className="nav-link" to="charts.html">
                        <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                        Charts
                    </Link>
                    <Link className="nav-link" to="tables.html">
                        <div className="sb-nav-link-icon"><i className="fas fa-table"></i></div>
                        Tables
                    </Link>
                </div>
            </div>
            <div className="sb-sidenav-footer">
                <div className="small">Logged in as:</div>
                {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Guest"}
            </div>
        </nav>

    );
}

export default Sidebar;