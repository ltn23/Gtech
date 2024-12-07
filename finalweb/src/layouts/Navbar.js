import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProfileDialog from "../components/Profile/ProfileDialog";

const Navbar = ({ toggleSidebar }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);

  const handleProfileClick = (e) => {
    e.preventDefault();
    setShowProfileDialog(true);
  };

  const handleCloseProfileDialog = () => {
    setShowProfileDialog(false);
  };

  const handleAuthButton = (e) => {
    const buttonText = e.target.textContent;
    if (buttonText === "Logout") {
      localStorage.clear();
      setIsLoggedIn(false); // Update the state after logout
      window.location.href = "/logout"; // Redirect after logout
    }
  };

  return (
    <>
      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        <Link
          className="navbar-brand ps-3"
          to="/dashboard"
          style={{ display: "flex", alignItems: "center" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
          </svg>
          <span style={{ marginLeft: "8px" }}>GTech</span>
        </Link>

        {/* <button
          className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
          id="sidebarToggle"
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button> */}
        <ul className="d-flex justify-content-end ms-auto me-0 me-md-3 my-2 my-md-0">
          {isLoggedIn && (
            <li className="nav-item me-2">
              <Link
                className="text-light nav-link px-3 py-2 rounded"
                to=""
                onClick={handleProfileClick} // Handle profile click
                style={{
                  backgroundColor: "#343a40",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#495057")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#343a40")
                }
              >
                Profile
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link
              onClick={handleAuthButton}
              className="text-light nav-link px-3 py-2 rounded"
              to={isLoggedIn ? "logout" : "login"}
              style={{
                backgroundColor: "#343a40",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#495057")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#343a40")}
            >
              {isLoggedIn ? "Logout" : "Login"}
            </Link>
          </li>
          {!isLoggedIn && ( 
            <li className="nav-item">
              <Link
                className="text-light nav-link px-3 py-2 rounded"
                to="register"
                style={{
                  backgroundColor: "#343a40",
                  transition: "all 0.3s ease",
                  marginLeft: "10px",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#495057")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#343a40")
                }
              >
                Register
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <ProfileDialog
        show={showProfileDialog}
        handleClose={handleCloseProfileDialog}
      />
    </>
  );
};

export default Navbar;
