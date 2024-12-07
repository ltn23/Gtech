import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Sidebar.css';

const Sidebar = ({ isSidebarOpen }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("guest");
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    const userRole = localStorage.getItem("role") || "guest";

    setIsLoggedIn(loggedInStatus);
    setRole(loggedInStatus ? userRole : "guest");

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await fetch("http://localhost:8000/api/categories");
    const data = await response.json();
    setCategories(data);
  };

  const menuItems = {
    admin: [
      { to: "/dashboard", label: "Dashboard", icon: "fas fa-tachometer-alt" },

      {
        to: "/user-management",
        label: "User Management",
        icon: "fas fa-users",
      },
      {
        to: "/category-management",
        label: "Category Management",
        icon: "fas fa-user-shield",
      },
      {
        to: "/product-management",
        label: "Product Management",
        icon: "fas fa-box",
      },
      { to: "/order-management", label: "Order Management", icon: "fas fa-clipboard-list" }
    ],
    customer: [
      { to: "/products", label: "Products", icon: "fas fa-tachometer-alt" },
      { to: "/shopping-cart", label: "Shopping Cart", icon: "fas fa-shopping-cart" },
      { to: "/my-orders", label: "My Orders", icon: "fas fa-box-open" },
      { to: "#", label: "Categories", icon: "fas fa-list", toggle: true },
    ],
    guest: [
      // { to: "/login", label: "Login", icon: "fas fa-sign-in-alt" },
      // { to: "/register", label: "Register", icon: "fas fa-user-plus" },
    ],
  };

  const currentMenuItems = menuItems[role] || menuItems["guest"];

  const handleToggleCategories = () => {
    setShowCategories(!showCategories);
  };

  return (
    <nav
      className={`sb-sidenav accordion sb-sidenav-dark ${
        isSidebarOpen ? "open" : "closed"
      }`}
      id="sidenavAccordion"
    >
      <div className="sb-sidenav-menu">
        <div className="nav">
          
          {currentMenuItems.map((item, index) => (
            <Link
              key={index}
              className="nav-link"
              to={item.to}
              onClick={item.toggle ? handleToggleCategories : undefined}
            >
              <div className="sb-nav-link-icon">
                <i className={item.icon}></i>
              </div>
              {item.label}
            </Link>
          ))}
          {showCategories && (
            <div className="sb-sidenav-menu-heading">Categories</div>
          )}
          {showCategories &&
            categories.map((category) => (
              <Link
                key={category.id}
                className="nav-link"
                to={`/products?category=${category.id}`}
              >
                <div className="sb-nav-link-icon">
                  <i className="fas fa-tag"></i>
                </div>
                {category.name}
              </Link>
            ))}
        
        </div>
      </div>
      <div className="sb-sidenav-footer">
        <div className="small">Logged in as:</div>
        {role === "guest"
          ? "Please login"
          : role.charAt(0).toUpperCase() + role.slice(1)}
      </div>
    </nav>
  );
};

export default Sidebar;
