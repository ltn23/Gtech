import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProfileDialog from "../components/Profile/ProfileDialog";

const Navbar = () => {
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
        <Link className="navbar-brand ps-3" to="/dashboard">
          GTECH
        </Link>
        {/* <button
          className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
          id="sidebarToggle"
          href="#!"
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
          {!isLoggedIn && ( // Show Register button if not logged in
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
