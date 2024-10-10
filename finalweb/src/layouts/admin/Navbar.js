import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // Get isLoggedIn status from local storage
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleAuthButton = (e) => {
    const buttonText = e.target.textContent;
    if (buttonText === "Logout") {
      window.location.href = "/logout";
    } else {
      return;
    }
  };

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
      <Link className="navbar-brand ps-3" to="/dashboard">
        Start Bootstrap
      </Link>
      <button
        className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
        id="sidebarToggle"
        href="#!"
      >
        <i className="fas fa-bars"></i>
      </button>
      <ul className="d-flex justify-content-end ms-auto me-0 me-md-3 my-2 my-md-0">
        <li className="nav-item">
          <Link
            onClick={handleAuthButton}
            className="text-light nav-link px-3 py-2 rounded"
            to={isLoggedIn === true ? "logout" : "login"}
            style={{
              backgroundColor: "#343a40",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#495057")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#343a40")}
          >
            {isLoggedIn === true ? "Logout" : "Login"}
          </Link>
        </li>
        {!isLoggedIn && ( // Chỉ hiển thị nút Register nếu chưa đăng nhập
          <li className="nav-item">
            <Link
              className="text-light nav-link px-3 py-2 rounded"
              to="register"
              style={{
                backgroundColor: "#343a40",
                transition: "all 0.3s ease",
                marginLeft: "10px", // Khoảng cách giữa nút Login và Register
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#495057")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#343a40")}
            >
              Register
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
