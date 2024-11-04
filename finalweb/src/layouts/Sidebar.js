import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
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
    // Replace with your API endpoint
    const response = await fetch("http://localhost:8000/api/categories");
    const data = await response.json();
    setCategories(data);
  };

  const menuItems = {
    admin: [
      { to: "/dashboard", label: "Dashboard", icon: "fas fa-tachometer-alt" },
      { to: "/admin-panel", label: "Admin Panel", icon: "fas fa-user-shield" },
      {
        to: "/user-management",
        label: "User Management",
        icon: "fas fa-users",
      },
      {
        to: "/category-management",
        label: "Category Management",
        icon: "fas fa-money",
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
      { to: "/order-confirmation", label: "OrderConfirmation", icon: "fas fa-box-open" },
      { to: "#", label: "Categories", icon: "fas fa-list", toggle: true }, 
    ],
    guest: [
      { to: "/login", label: "Login", icon: "fas fa-sign-in-alt" },
      { to: "/register", label: "Register", icon: "fas fa-user-plus" },
    ],
  };

  const currentMenuItems = menuItems[role] || menuItems["guest"];

  const handleToggleCategories = () => {
    setShowCategories(!showCategories);
  };

  return (
    <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
      <div className="sb-sidenav-menu">
        <div className="nav">
          <div className="sb-sidenav-menu-heading">Core</div>
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
          {isLoggedIn && (
            <>
              <div className="sb-sidenav-menu-heading">Addons</div>
              <Link className="nav-link" to="/charts">
                <div className="sb-nav-link-icon">
                  <i className="fas fa-chart-area"></i>
                </div>
                Charts
              </Link>
              <Link className="nav-link" to="/tables">
                <div className="sb-nav-link-icon">
                  <i className="fas fa-table"></i>
                </div>
                Tables
              </Link>
            </>
          )}
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
